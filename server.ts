import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Helper to safely call Gemini with JSON response schema, automatic retries and fallback models
async function generateJSON(systemPrompt: string, userPrompt: string, temperature = 0.7) {
  const modelsToTry = [
    "gemini-3.7-flash",
    "gemini-flash-latest",
    "gemini-2.5-flash-preview-12-2025",
    "gemini-3.1-flash-lite",
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    // Retry up to 2 times per model with exponential backoff if 503/429 occurs
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt + "\nRetorne APENAS JSON válido, sem blocos markdown ou explicações fora do JSON.",
            responseMimeType: "application/json",
            temperature,
          },
        });

        const text = response.text || "{}";
        try {
          return JSON.parse(text);
        } catch (err) {
          // Clean potential markdown quotes
          const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
          return JSON.parse(cleaned);
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = (err.message || "").toLowerCase();
        const isTransient =
          errMsg.includes("503") ||
          errMsg.includes("high demand") ||
          errMsg.includes("unavailable") ||
          errMsg.includes("429") ||
          errMsg.includes("resource_exhausted") ||
          errMsg.includes("rate limit") ||
          errMsg.includes("overloaded");

        console.warn(`[Gemini API] Tentativa ${attempt} com modelo ${modelName} falhou:`, err.message || err);

        if (isTransient) {
          // Wait before retrying (exponential backoff: 1.2s, 2.5s)
          await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
          continue; // Try next attempt with current model
        } else {
          // If it's not a transient load error (e.g. fatal syntax), try next model or break
          break;
        }
      }
    }
  }

  throw new Error(
    lastError?.message ||
      "O servidor de IA está com alta demanda momentânea. Por favor, tente novamente em instantes."
  );
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), model: "gemini-3.7-flash" });
});

// 2. Fetch or scrape URL preview content safely
app.post("/api/fetch-url-content", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL é obrigatória" });
  }

  try {
    // Attempt standard fetch with User-Agent
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return res.json({
        success: false,
        message: `Não foi possível acessar a URL diretamente (Status: ${response.status}). A análise usará inteligência estratégica direta sobre o link e contexto.`,
        url,
        extractedText: "",
      });
    }

    const html = await response.text();
    // Basic clean text extraction (strip scripts, styles, tags)
    const cleaned = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 15000); // 15k characters snippet

    return res.json({
      success: true,
      url,
      extractedText: cleaned,
      title: (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || url,
    });
  } catch (err: any) {
    return res.json({
      success: false,
      message: `Acesso via proxy local indisponível (${err.message}). O Gemini analisará a URL e qualquer nota contextual fornecida.`,
      url,
      extractedText: "",
    });
  }
});

// 3. Analyze Offer (Análise Estratégica da Oferta + Score 0-100 + 5 Oportunidades Derivadas)
app.post("/api/analyze-offer", async (req, res) => {
  const { url, rawContent, contextNotes } = req.body;
  const startTime = Date.now();

  try {
    const systemPrompt = `Você é um Estrategista Sênior de Marketing Digital, Copywriting e Engenharia de Ofertas de classe mundial da "Central de Vendas com IA".
Sua tarefa é analisar criticamente uma página/oferta de referência (${url || "URL informada"}), dissecando toda a sua mecânica comercial, pontos fortes, vulnerabilidades e gerar 5 Oportunidades de Negócios e Produtos Inovadores estritamente vinculadas e customizadas para o nicho, problemas e público da URL.
IMPORTANTE: Não copie frases, marcas ou propriedade intelectual da URL. Extraia a arquitetura estratégica profunda e crie 5 alternativas e produtos complementares inovadores com alto potencial de mercado.

Retorne um objeto JSON estritamente no seguinte formato:
{
  "nicho": "string",
  "subnicho": "string",
  "publicoAlvo": "string",
  "avatar": {
    "perfil": "string",
    "dores": ["string"],
    "desejos": ["string"],
    "medos": ["string"],
    "objecoes": ["string"]
  },
  "problemaPrincipal": "string",
  "transformacaoPrometida": "string",
  "propostaValor": "string",
  "mecanismoOferta": "string",
  "diferencial": "string",
  "estruturaOferta": {
    "produtos": ["string"],
    "bonus": ["string"],
    "garantia": "string",
    "cta": "string",
    "estrategiaPreco": "string",
    "modeloMonetizacao": "string"
  },
  "funilProvavel": {
    "tipo": "string",
    "leadMagnet": "string",
    "orderBump": "string",
    "upsell": "string",
    "downsell": "string"
  },
  "estrategiaAquisicao": {
    "angulosMarketing": ["string"],
    "gatilhosUtilizados": ["string"],
    "elementosProvaSocial": ["string"]
  },
  "diagnostico": {
    "pontosFortes": ["string"],
    "pontosFracos": ["string"],
    "oportunidadesDiferenciacao": ["string"]
  },
  "score": {
    "geral": number (0 a 100),
    "clarezaOferta": number (0 a 100),
    "forcaPromessa": number (0 a 100),
    "clarezaPublico": number (0 a 100),
    "diferenciacao": number (0 a 100),
    "potencialComercial": number (0 a 100),
    "estruturaFunil": number (0 a 100),
    "potencialRecorrencia": number (0 a 100),
    "potencialExpansao": number (0 a 100),
    "facilidadeCriacao": number (0 a 100),
    "potencialAquisicao": number (0 a 100),
    "parecerEstrategico": "string com justificativa analítica detalhada"
  },
  "oportunidades": [
    {
      "id": "op-1",
      "nomeProvisorio": "string",
      "tagline": "string",
      "nicho": "string",
      "subnicho": "string",
      "publico": "string",
      "problema": "string",
      "desejo": "string",
      "solucaoProposta": "string",
      "mecanismoUnico": "string",
      "diferencial": "string (como supera ou complementa a oferta da URL analisada)",
      "formatoRecomendado": "string (ex: SaaS, E-book, Curso, Aplicativo, Área de membros)",
      "modeloMonetizacao": "string",
      "faixaPrecoSugerida": "string",
      "complexidade": "Baixa" | "Média" | "Alta",
      "potencialExpansao": "string",
      "justificativaEstrategica": "string",
      "anguloInovacao": "string"
    }
  ]
}`;

    const userPrompt = `Analise a seguinte oferta/referência e gere a dissecação completa + as 5 oportunidades de produtos derivadas:
URL de Referência: ${url || "Não informada (análise por conteúdo)"}
${rawContent ? `Conteúdo extraído da página da URL: """\n${rawContent.slice(0, 12000)}\n"""` : ""}
${contextNotes ? `Notas e contexto adicional fornecidos pelo usuário: """\n${contextNotes}\n"""` : ""}

Realize uma dissecação estratégica completa com todos os campos requisitados, atribua o Score de 0 a 100 fundamentado e gere EXATAMENTE 5 oportunidades de produtos e novos negócios derivadas diretamente do nicho e contexto da URL analisada.`;

    const result = await generateJSON(systemPrompt, userPrompt, 0.6);
    const durationMs = Date.now() - startTime;

    if (url && result) {
      result.url = url;
    }

    res.json({
      success: true,
      analysis: result,
      metadata: {
        durationMs,
        analyzedAt: new Date().toISOString(),
        url,
      },
    });
  } catch (err: any) {
    console.error("Erro na análise da oferta:", err);
    res.status(500).json({ error: err.message || "Erro ao processar análise da oferta" });
  }
});

// 4. Generate 5 Original Opportunities (Gerador de Oportunidades Originais com base na URL)
app.post("/api/generate-opportunities", async (req, res) => {
  const { analysis, customDirections, url } = req.body;
  const startTime = Date.now();
  const urlRef = url || analysis?.url || "URL informada";

  try {
    const systemPrompt = `Você é um Gerador de Inovação de Produtos e Novos Negócios da "Central de Vendas com IA".
Com base na análise estratégica e na URL de referência informada (${urlRef}), gere EXATAMENTE 5 oportunidades de produtos e negócios COMPLETAMENTE ORIGINAIS e altamente lucrativos, rigorosamente contextualizadas no nicho e público da URL.

DIRETRIZES FUNDAMENTAIS:
- As 5 ideias DEVEM ser modeladas de acordo com a URL/oferta analisada (${urlRef}).
- Não faça meras cópias ou pequenas alterações cosméticas da oferta analisada.
- Explore soluções que resolvam os pontos fracos da URL, atendam sub-segmentos negligenciados e utilizem formatos modernos (ex: SaaS/Micro-app com IA, E-book + Checklist Prático, Curso Híbrido com Mentoria, Área de Membros Recorrente, Plataforma Gamificada).
- Cada oportunidade deve ter viabilidade comercial imediata, alto valor percebido e diferenciação clara em relação à oferta original da URL.

Retorne um array JSON com exatamente 5 objetos no formato:
{
  "opportunities": [
    {
      "id": "op-1",
      "nomeProvisorio": "string",
      "tagline": "string",
      "nicho": "string",
      "subnicho": "string",
      "publico": "string",
      "problema": "string",
      "desejo": "string",
      "solucaoProposta": "string",
      "mecanismoUnico": "string",
      "diferencial": "string (diferencial claro em relação à URL de referência)",
      "formatoRecomendado": "string",
      "modeloMonetizacao": "string",
      "faixaPrecoSugerida": "string (ex: R$ 97 a R$ 297)",
      "complexidade": "Baixa" | "Média" | "Alta",
      "potencialExpansao": "string",
      "justificativaEstrategica": "string",
      "anguloInovacao": "string"
    }
  ]
}`;

    const userPrompt = `URL de Referência da Oferta Analisada: ${urlRef}

Análise da oferta de referência:
${JSON.stringify(analysis, null, 2)}
${customDirections ? `Direcionamento adicional do usuário: "${customDirections}"` : ""}

Gere as 5 oportunidades inovadoras e estratégicas diretamente relacionadas e contextualizadas para a URL analisada.`;

    const result = await generateJSON(systemPrompt, userPrompt, 0.8);
    const durationMs = Date.now() - startTime;

    res.json({
      success: true,
      opportunities: result.opportunities || [],
      metadata: { durationMs, timestamp: new Date().toISOString(), url: urlRef },
    });
  } catch (err: any) {
    console.error("Erro ao gerar oportunidades:", err);
    res.status(500).json({ error: err.message || "Erro ao gerar oportunidades" });
  }
});

// 5. Create Master Project (Criação do Projeto Mestre e Memória Central)
app.post("/api/create-master-project", async (req, res) => {
  const { opportunity, selectedFormats, userCustomizations, sourceUrl } = req.body;
  const startTime = Date.now();
  const urlRef = sourceUrl || opportunity?.sourceUrl || "";

  try {
    const systemPrompt = `Você é o Arquiteto-Chefe de Negócios Digitais da "Central de Vendas com IA".
Sua função é transformar uma oportunidade selecionada (modelada a partir da URL ${urlRef || "de referência"}) e os formatos de produto escolhidos em um PROJETO-MESTRE completo e definitivo.
O Projeto-Mestre servirá como a MEMÓRIA CENTRAL e a Única Fonte da Verdade (Single Source of Truth) para todos os geradores de copywriting, landing pages, criativos, funis, e-books, apps e e-mails.

Retorne um JSON no formato:
{
  "nomeProduto": "string",
  "slug": "string",
  "nicho": "string",
  "subnicho": "string",
  "bigIdea": "string",
  "posicionamento": "string",
  "propostaUnicaValor": "string",
  "mecanismoUnico": {
    "nome": "string",
    "explicacao": "string"
  },
  "promessaPrincipal": "string",
  "promessasSecundarias": ["string"],
  "avatar": {
    "nome": "string",
    "perfilDemografico": "string",
    "momentoVidaContexto": "string",
    "doresProfundas": ["string"],
    "desejosSecretos": ["string"],
    "medosInconfessaveis": ["string"],
    "principaisObjecoes": ["string"],
    "inimigoComum": "string",
    "linguagemETermoChave": ["string"]
  },
  "oferta": {
    "nomeOferta": "string",
    "precoPrincipal": "string",
    "modeloMonetizacao": "string",
    "ancoragem": "string",
    "garantia": "string",
    "urgencia": "string",
    "escassezEtica": "string",
    "ctaPrincipal": "string",
    "bonusExclusivos": [
      {
        "titulo": "string",
        "valorPercebido": "string",
        "descricao": "string"
      }
    ]
  },
  "formatosEscolhidos": ["string"],
  "tomDeVoz": "string (ex: Autoritário & Empático, Direto & Acolhedor)",
  "estrategiaFunil": {
    "modeloPrincipal": "string",
    "resumoEtapas": ["string"],
    "sugestaoOrderBump": "string",
    "sugestaoUpsell": "string",
    "sugestaoDownsell": "string"
  },
  "regrasMemoria": [
    "string de regra inviolável (ex: 'Nunca prometer enriquecimento fácil', 'Foco estrito em profissionais liberais')"
  ]
}`;

    const userPrompt = `Oportunidade Selecionada:
${JSON.stringify(opportunity, null, 2)}

Formatos de Produto Escolhidos pelo Usuário:
${JSON.stringify(selectedFormats)}

Customizações Adicionais:
${JSON.stringify(userCustomizations || {})}

Construa o Projeto-Mestre definitivo e estruturado para alimentar todo o ecossistema.`;

    const result = await generateJSON(systemPrompt, userPrompt, 0.6);
    const durationMs = Date.now() - startTime;

    if (result && urlRef) {
      result.sourceUrl = urlRef;
    }

    res.json({
      success: true,
      masterProject: result,
      metadata: { durationMs, createdAt: new Date().toISOString(), sourceUrl: urlRef },
    });
  } catch (err: any) {
    console.error("Erro ao criar projeto mestre:", err);
    res.status(500).json({ error: err.message || "Erro ao criar projeto mestre" });
  }
});

// 6. Copywriting Hub Generator (Central de Copywriting)
app.post("/api/generate-copywriting", async (req, res) => {
  const { masterProject, targetModule } = req.body;
  const startTime = Date.now();

  try {
    const systemPrompt = `Você é o Diretor de Copywriting da "Central de Vendas com IA".
Utilize estritamente a Memória Central do Projeto-Mestre fornecido para produzir copies de alta conversão, persuasão ética e alto impacto.
Mantenha consistência absoluta com o Avatar, Mecanismo Único, Big Idea e Oferta.

Retorne um JSON no formato:
{
  "headlines": {
    "diretas": ["string"],
    "curiosidade": ["string"],
    "beneficio": ["string"],
    "problema": ["string"],
    "transformacao": ["string"],
    "especificas": ["string"],
    "anuncios": ["string"]
  },
  "subheadlines": ["string"],
  "ctas": {
    "diretos": ["string"],
    "comBeneficio": ["string"],
    "comUrgencia": ["string"],
    "baixoAtrito": ["string"]
  },
  "bulletsPersuasivos": [
    {
      "icone": "string",
      "fascinio": "string",
      "explicacao": "string"
    }
  ],
  "quebraObjecoes": [
    {
      "objecao": "string",
      "respostaCopy": "string",
      "tecnica": "string"
    }
  ],
  "provasEArgumentos": [
    {
      "pilar": "string",
      "argumentoLogico": "string",
      "analogia": "string"
    }
  ],
  "microCopies": {
    "garantiaBadge": "string",
    "urgenciaTimer": "string",
    "checkoutSeguro": "string"
  }
}`;

    const userPrompt = `Projeto-Mestre:
${JSON.stringify(masterProject, null, 2)}
Módulo solicitado: ${targetModule || "Geral / Completo"}

Gere a Central de Copywriting completa e personalizada.`;

    const result = await generateJSON(systemPrompt, userPrompt, 0.7);
    const durationMs = Date.now() - startTime;

    res.json({
      success: true,
      copywriting: result,
      metadata: { durationMs },
    });
  } catch (err: any) {
    console.error("Erro ao gerar copy:", err);
    res.status(500).json({ error: err.message || "Erro ao gerar copy" });
  }
});

// 7. Landing Page Generator (16 Seções Completas)
app.post("/api/generate-landing-page", async (req, res) => {
  const { masterProject, stylePreference } = req.body;
  const startTime = Date.now();

  try {
    const systemPrompt = `Você é um Copywriter e Especialista em Páginas de Alta Conversão.
Crie a estrutura e o conteúdo completo de uma Landing Page com as 16 SEÇÕES ESTRUTURAIS PADRÃO OURO:
1. Hero
2. Headline
3. Subheadline
4. CTA Principal
5. Problema & Identificação
6. Agitação da Dor
7. Apresentação da Solução & Mecanismo Único
8. Benefícios Chave
9. Como Funciona Passo a Passo
10. Diferencial Competitivo
11. O Que Está Incluído (Entregáveis)
12. Bônus Exclusivos
13. Prova Social Estruturada
14. Garantia Incondicional
15. FAQ Completo
16. CTA Final & Fechamento com Escassez Ética

Retorne um JSON com a seguinte estrutura:
{
  "meta": {
    "pageTitle": "string",
    "metaDescription": "string",
    "primaryColor": "string"
  },
  "sections": [
    {
      "id": 1,
      "tag": "hero",
      "title": "Hero & Badges",
      "badge": "string",
      "headline": "string",
      "subheadline": "string",
      "ctaText": "string",
      "ctaSubtext": "string",
      "bulletPoints": ["string"]
    },
    {
      "id": 2,
      "tag": "problema",
      "title": "Identificação do Problema",
      "heading": "string",
      "narrativa": "string",
      "sintomas": ["string"]
    },
    {
      "id": 3,
      "tag": "agitacao",
      "title": "Agitação da Dor e Consequências",
      "heading": "string",
      "cenarioNegativo": "string",
      "custoDeNaoAgir": "string"
    },
    {
      "id": 4,
      "tag": "solucao",
      "title": "Apresentação da Solução & Mecanismo",
      "heading": "string",
      "nomeSolucao": "string",
      "explicacaoMecanismo": "string",
      "pontosChave": ["string"]
    },
    {
      "id": 5,
      "tag": "beneficios",
      "title": "Benefícios Claros e Transformadores",
      "heading": "string",
      "items": [
        { "titulo": "string", "descricao": "string" }
      ]
    },
    {
      "id": 6,
      "tag": "como_funciona",
      "title": "Como Funciona (3 ou 4 Passos)",
      "heading": "string",
      "steps": [
        { "stepNumber": 1, "titulo": "string", "descricao": "string" }
      ]
    },
    {
      "id": 7,
      "tag": "diferenciais",
      "title": "Por que é Diferente de Tudo",
      "heading": "string",
      "comparativo": [
        { "outros": "string", "esteProduto": "string" }
      ]
    },
    {
      "id": 8,
      "tag": "entregaveis",
      "title": "O Que Você Vai Receber",
      "heading": "string",
      "modulosOuItens": [
        { "nome": "string", "resumo": "string", "valorEstimado": "string" }
      ]
    },
    {
      "id": 9,
      "tag": "bonus",
      "title": "Bônus Exclusivos de Ação Rápida",
      "heading": "string",
      "bonusList": [
        { "titulo": "string", "descricao": "string", "valor": "string" }
      ]
    },
    {
      "id": 10,
      "tag": "garantia",
      "title": "Garantia Blindada",
      "heading": "string",
      "diasGarantia": "string (ex: 7 dias ou 30 dias)",
      "textoGarantia": "string"
    },
    {
      "id": 11,
      "tag": "oferta_preco",
      "title": "Tabela de Preço & Oferta Irresistível",
      "heading": "string",
      "precoAncorado": "string",
      "precoAtual": "string",
      "parcelamento": "string",
      "ctaText": "string",
      "garantiaBadge": "string"
    },
    {
      "id": 12,
      "tag": "faq",
      "title": "Perguntas Frequentes (FAQ)",
      "heading": "string",
      "faqs": [
        { "pergunta": "string", "resposta": "string" }
      ]
    },
    {
      "id": 13,
      "tag": "cta_final",
      "title": "Chamada Final & Decisão",
      "heading": "string",
      "texto": "string",
      "ctaText": "string",
      "alertaEscassez": "string"
    }
  ]
}`;

    const userPrompt = `Projeto-Mestre:
${JSON.stringify(masterProject, null, 2)}
Estilo visual/tom: ${stylePreference || "Moderno, direto e de alta conversão"}

Gere o conteúdo completo de todas as seções da Landing Page.`;

    const result = await generateJSON(systemPrompt, userPrompt, 0.7);
    const durationMs = Date.now() - startTime;

    res.json({
      success: true,
      landingPage: result,
      metadata: { durationMs },
    });
  } catch (err: any) {
    console.error("Erro ao gerar landing page:", err);
    res.status(500).json({ error: err.message || "Erro ao gerar landing page" });
  }
});

// 8. Creative & Ads Generator (Meta Ads, Stories, Reels, Carrossel)
app.post("/api/generate-creatives", async (req, res) => {
  const { masterProject, platforms } = req.body;
  const startTime = Date.now();

  try {
    const systemPrompt = `Você é um Diretor de Tráfego Pago e Copywriter de Anúncios de Alta Performance da "Central de Vendas com IA".
Com base no Projeto-Mestre, crie um pacote completo de criativos persuasivos segmentados por formatos para Meta Ads (Feed, Stories/Reels, Carrosséis) e outros canais.
Cada criativo deve conter Hook (Gancho nos primeiros 3 segundos), Headline, Texto Principal, CTA, Roteiro/Instrução Visual, Ângulo de Abordagem e Público Alvo sugerido.

Retorne um JSON no formato:
{
  "creatives": [
    {
      "id": "ad-1",
      "formato": "Feed Estático / Vídeo 1:1" | "Stories / Reels 9:16" | "Carrossel 1:1" | "Direto ao Ponto",
      "angulo": "Dor Aguda" | "Curiosidade / Mecanismo" | "Contra-Intuitivo" | "Estudo de Caso" | "Oportunidade Imediata",
      "hook": "string",
      "headline": "string",
      "primaryText": "string",
      "cta": "string",
      "ideiaVisual": "string (descrição detalhada para designer ou gerador de imagem)",
      "roteiroCompleto": "string (para vídeo ou carrossel com slide a slide)",
      "publicoRecomendado": "string"
    }
  ],
  "dicasDeSegmentacao": ["string"]
}`;

    const userPrompt = `Projeto-Mestre:
${JSON.stringify(masterProject, null, 2)}
Plataformas solicitadas: ${JSON.stringify(platforms || ["Meta Ads", "Instagram Feed", "Stories", "Reels", "Carrossel"])}

Gere no mínimo 6 criativos diversificados cobrindo diferentes ângulos e formatos.`;

    const result = await generateJSON(systemPrompt, userPrompt, 0.75);
    const durationMs = Date.now() - startTime;

    res.json({
      success: true,
      creatives: result.creatives || [],
      dicasDeSegmentacao: result.dicasDeSegmentacao || [],
      metadata: { durationMs },
    });
  } catch (err: any) {
    console.error("Erro ao gerar criativos:", err);
    res.status(500).json({ error: err.message || "Erro ao gerar criativos" });
  }
});

// 9. Funnel Architect & Bumps/Upsells/Downsells (Gerador de Funis e Micro-ofertas)
app.post("/api/generate-funnel", async (req, res) => {
  const { masterProject, funnelType } = req.body;
  const startTime = Date.now();

  try {
    const systemPrompt = `Você é um Engenheiro de Funis de Vendas e Otimização de Lucro por Cliente (LTV) da "Central de Vendas com IA".
Com base no Projeto-Mestre, projete a arquitetura completa do funil de vendas, detalhando:
- Etapas do Funil com taxas de conversão estimadas
- Order Bump irresistível (anexado ao checkout)
- Upsell 1 (oferta de maior valor ou aceleração)
- Downsell 1 (alternativa de menor atrito se recusar o Upsell)
- Upsell 2 / Acesso Contínuo / Recorrência

Retorne um JSON no formato:
{
  "tipoFunil": "string",
  "descricaoEstrategica": "string",
  "etapas": [
    {
      "step": 1,
      "nome": "string",
      "tipo": "Trafego" | "LandingPage" | "Checkout" | "OrderBump" | "Upsell" | "Downsell" | "Entrega",
      "acaoEsperada": "string",
      "taxaConversaoMediaEstimada": "string"
    }
  ],
  "orderBump": {
    "nome": "string",
    "preco": "string",
    "beneficioChave": "string",
    "copyCheckbox": "string",
    "justificativaEstrategica": "string",
    "relacaoProdutoPrincipal": "string"
  },
  "upsell": {
    "nome": "string",
    "preco": "string",
    "headline": "string",
    "beneficios": ["string"],
    "ctaAceitar": "string",
    "ctaRecusar": "string",
    "argumentacaoCopy": "string"
  },
  "downsell": {
    "nome": "string",
    "preco": "string",
    "ofertaReduzida": "string",
    "copy": "string",
    "cta": "string",
    "justificativa": "string"
  }
}`;

    const userPrompt = `Projeto-Mestre:
${JSON.stringify(masterProject, null, 2)}
Tipo de funil preferido: ${funnelType || "Funil Low-Ticket com Esteira de Upsell & Order Bump"}

Gere a arquitetura de funil completa com todas as ofertas de esteira.`;

    const result = await generateJSON(systemPrompt, userPrompt, 0.7);
    const durationMs = Date.now() - startTime;

    res.json({
      success: true,
      funnel: result,
      metadata: { durationMs },
    });
  } catch (err: any) {
    console.error("Erro ao gerar funil:", err);
    res.status(500).json({ error: err.message || "Erro ao gerar funil" });
  }
});

// 10. Format Specific Generators (E-book, App/SaaS PRD, Curso/Membros, Microsite)
app.post("/api/generate-format-asset", async (req, res) => {
  const { masterProject, formatType, specificOptions } = req.body;
  const startTime = Date.now();

  try {
    let systemPrompt = "";
    let userPrompt = "";

    if (formatType === "ebook") {
      systemPrompt = `Você é um Autor Best-Seller e Estrategista de Infoprodutos.
Gere a estrutura completa e o conteúdo mestre de um E-BOOK irresistível alinhado ao Projeto-Mestre.
Retorne um JSON com:
{
  "nomeEbook": "string",
  "subtitulo": "string",
  "promessa": "string",
  "sumario": [
    {
      "numero": number,
      "titulo": "string",
      "resumo": "string",
      "topicos": ["string"],
      "exercicioOuChecklist": "string"
    }
  ],
  "introducaoCompleta": "string (texto longo e envolvente)",
  "amostraCapitulo1": "string (conteúdo didático rico e prático)",
  "conclusaoECTA": "string",
  "ofertaComplementarFinal": "string"
}`;
      userPrompt = `Projeto-Mestre: ${JSON.stringify(masterProject, null, 2)}\nGere o esqueleto e conteúdo do E-book.`;
    } else if (formatType === "app" || formatType === "saas") {
      systemPrompt = `Você é um Product Manager Sênior e Arquiteto de Software para SaaS / Aplicativos.
Gere um PRD (Product Requirements Document) completo, Especificação Técnica e PROMPT TÉCNICO OTIMIZADO PARA O LOVABLE / CURSOR / AI IDEs.
Retorne um JSON com:
{
  "nomeApp": "string",
  "tagline": "string",
  "objetivoPrincipal": "string",
  "publicoAlvo": "string",
  "propostaValor": "string",
  "funcionalidadesMVP": [
    { "modulo": "string", "descricao": "string", "prioridade": "Essencial" | "Importante" | "Diferencial" }
  ],
  "fluxoUsuario": ["string"],
  "telasPrincipais": [
    { "nome": "string", "proposito": "string", "elementosChave": ["string"] }
  ],
  "arquiteturaBancoDados": {
    "tabelas": [
      { "tabela": "string", "campos": ["string"], "relacionamentos": "string" }
    ]
  },
  "modeloMonetizacaoETiers": [
    { "plano": "string", "preco": "string", "limitesOuRecursos": ["string"] }
  ],
  "promptTecnicoParaLovable": "string (um super prompt detalhado para colar no Lovable/Cursor e gerar o app funcional de imediato)",
  "planoLancamento": ["string"]
}`;
      userPrompt = `Projeto-Mestre: ${JSON.stringify(masterProject, null, 2)}\nGere o PRD completo e Prompt Lovable para Aplicativo/SaaS.`;
    } else if (formatType === "curso" || formatType === "membros") {
      systemPrompt = `Você é um Designer Instrucional e Especialista em Áreas de Membros e Cursos Digitais.
Gere a estrutura completa da grade curricular, onboarding, aulas práticas e estratégias de retenção/gamificação.
Retorne um JSON com:
{
  "nomeCurso": "string",
  "promessaEducacional": "string",
  "onboardingBoasVindas": "string",
  "modulos": [
    {
      "moduloNumero": number,
      "nome": "string",
      "objetivo": "string",
      "aulas": [
        { "titulo": "string", "duracaoEstimada": "string", "descricao": "string", "materialApoio": "string" }
      ]
    }
  ],
  "projetoFinal": "string",
  "mecanismoGamificacaoERetencao": ["string"],
  "estrategiaUpsellInterna": "string"
}`;
      userPrompt = `Projeto-Mestre: ${JSON.stringify(masterProject, null, 2)}\nGere a estrutura completa do Curso / Área de Membros.`;
    } else {
      // Microsite or generic
      systemPrompt = `Você é um Arquiteto de Sites e Microsites de Conversão.
Gere a arquitetura de páginas, navegação, captura de leads e áreas de conteúdo do Microsite.
Retorne um JSON com:
{
  "nomeSite": "string",
  "estruturaPaginas": [
    { "pagina": "string", "slug": "string", "objetivo": "string", "secoes": ["string"] }
  ],
  "formularioCaptura": {
    "titulo": "string",
    "campos": ["string"],
    "cta": "string",
    "iscaDigital": "string"
  },
  "linksEstrategicos": ["string"]
}`;
      userPrompt = `Projeto-Mestre: ${JSON.stringify(masterProject, null, 2)}\nGere a estrutura do Microsite.`;
    }

    const result = await generateJSON(systemPrompt, userPrompt, 0.7);
    const durationMs = Date.now() - startTime;

    res.json({
      success: true,
      formatType,
      asset: result,
      metadata: { durationMs },
    });
  } catch (err: any) {
    console.error("Erro ao gerar ativo de formato:", err);
    res.status(500).json({ error: err.message || "Erro ao gerar ativo de formato" });
  }
});

// 11. Email, WhatsApp & Sales Scripts Sequences (Sequências de E-mail, WhatsApp e Scripts)
app.post("/api/generate-sequences", async (req, res) => {
  const { masterProject, sequenceType } = req.body;
  const startTime = Date.now();

  try {
    const systemPrompt = `Você é um Copywriter Especialista em Automação de E-mails, Conversão por WhatsApp e Scripts de Vendas 1-a-1.
Gere sequências de comunicação completas respeitando o Projeto-Mestre.
Retorne um JSON com:
{
  "emails": {
    "captura": [
      { "assunto": "string", "preHeader": "string", "corpo": "string", "cta": "string" }
    ],
    "vendas": [
      { "dia": number, "assunto": "string", "angulo": "string", "corpo": "string", "cta": "string" }
    ],
    "posCompra": [
      { "assunto": "string", "gatilho": "string", "corpo": "string" }
    ]
  },
  "whatsapp": [
    { "fase": "Primeiro Contato / Boas-Vindas" | "Qualificação" | "Follow-up Suave" | "Recuperação de Carrinho" | "Quebra de Objeção" | "Pós-Venda", "mensagem": "string", "audioScriptOpcional": "string" }
  ],
  "scriptsVendas": {
    "scriptWhatsApp1a1": "string",
    "scriptDirectInstagram": "string",
    "roteiroVSLVideo": "string",
    "pitchLigacao": "string"
  }
}`;

    const userPrompt = `Projeto-Mestre:
${JSON.stringify(masterProject, null, 2)}
Gere as sequências completas de e-mails, mensagens de WhatsApp e scripts de vendas prontos para copiar e colar.`;

    const result = await generateJSON(systemPrompt, userPrompt, 0.7);
    const durationMs = Date.now() - startTime;

    res.json({
      success: true,
      sequences: result,
      metadata: { durationMs },
    });
  } catch (err: any) {
    console.error("Erro ao gerar sequências:", err);
    res.status(500).json({ error: err.message || "Erro ao gerar sequências" });
  }
});

// 12. Business Expansion Advisor ("O que você quer criar agora?")
app.post("/api/expand-project", async (req, res) => {
  const { masterProject } = req.body;
  const startTime = Date.now();

  try {
    const systemPrompt = `Você é um Consultor de Escala de Negócios e Criação de Ecossistemas Comerciais.
Com base no Projeto-Mestre já validado, sugira 4 caminhos de expansão de alto impacto para multiplicar o faturamento do negócio.
Retorne um JSON com:
{
  "expansions": [
    {
      "tipo": "Novo Produto Front-End" | "Produto High-Ticket" | "Comunidade / Recorrência" | "Software / SaaS Companion" | "Serviço Done-For-You",
      "titulo": "string",
      "proposta": "string",
      "justificativa": "string",
      "precosSugeridos": "string",
      "sinergiaComProjetoAtual": "string"
    }
  ]
}`;

    const userPrompt = `Projeto-Mestre:
${JSON.stringify(masterProject, null, 2)}
Gere as melhores sugestões estratégicas de expansão.`;

    const result = await generateJSON(systemPrompt, userPrompt, 0.7);
    const durationMs = Date.now() - startTime;

    res.json({
      success: true,
      expansions: result.expansions || [],
      metadata: { durationMs },
    });
  } catch (err: any) {
    console.error("Erro ao gerar expansões:", err);
    res.status(500).json({ error: err.message || "Erro ao gerar expansões" });
  }
});

// ----------------------------------------------------
// SERVER BOOTSTRAP & VITE INTEGRATION
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Central de Vendas com IA running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
