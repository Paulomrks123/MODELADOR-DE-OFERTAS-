import {
  MasterProject,
  OfferAnalysis,
  Opportunity,
  CopywritingHub,
  LandingPageAsset,
  CreativesAsset,
  FunnelAsset,
  FormatAssetData,
  SequencesAsset,
  ExpansionItem,
  ProjectMemoryFact,
  TelemetryLog,
} from "../types";

const STORAGE_KEYS = {
  PROJECTS: "cv_ia_projects_v1",
  ACTIVE_PROJECT_ID: "cv_ia_active_project_id_v1",
  ANALYSES: "cv_ia_analyses_v1",
  OPPORTUNITIES: "cv_ia_opportunities_v1",
  MEMORY_FACTS: "cv_ia_memory_facts_v1",
  TELEMETRY: "cv_ia_telemetry_v1",
  FORMAT_ASSETS: "cv_ia_format_assets_v1",
  COPY_ASSETS: "cv_ia_copy_assets_v1",
  LP_ASSETS: "cv_ia_lp_assets_v1",
  CREATIVES_ASSETS: "cv_ia_creatives_assets_v1",
  FUNNEL_ASSETS: "cv_ia_funnel_assets_v1",
  SEQUENCE_ASSETS: "cv_ia_sequence_assets_v1",
  EXPANSION_ASSETS: "cv_ia_expansion_assets_v1",
};

// Default high-value sample project to demonstrate complete workflow immediately
const SAMPLE_ANALYSIS: OfferAnalysis = {
  nicho: "Produtividade & Negócios Digitais",
  subnicho: "Gestão de Tempo para Criadores e Solopreneurs",
  publicoAlvo: "Profissionais liberais, consultores e criadores de conteúdo sobrecarregados",
  avatar: {
    perfil: "Solopreneur de 28 a 45 anos que trabalha 12h/dia mas sente que não progride",
    dores: [
      "Sensação constante de estar apagando incêndios",
      "Dificuldade de delegar ou automatizar tarefas operacionais",
      "Ansiedade por ter muitas abas abertas e baixa execução",
    ],
    desejos: [
      "Trabalhar 4 a 6 horas por dia com faturamento previsível",
      "Ter um sistema claro de execução que funcione no automático",
      "Liberdade de tempo e paz mental sem sacrificar receita",
    ],
    medos: [
      "Queimar o negócio por esgotamento (burnout)",
      "Perder clientes por esquecer prazos ou perder qualidade",
    ],
    objecoes: [
      "Já tentei Notion, Trello e dezenas de apps e desisti",
      "Não tenho tempo para aprender um método complexo",
    ],
  },
  problemaPrincipal: "Falta de um sistema operacional pessoal blindado contra distrações e sobrecarga",
  transformacaoPrometida: "Dominar uma rotina enxuta de 4 horas focadas com o dobro de entregas comerciais",
  propostaValor: "O Sistema Operacional Pessoal que transforma caos de solopreneur em máquina de vendas",
  mecanismoOferta: "Protocolo de Blocos de Impacto e Automação Cognitiva (PBI)",
  diferencial: "Não é mais um curso teórico, mas um ecossistema pronto para importar e rodar em 15 minutos",
  estruturaOferta: {
    produtos: ["Treinamento Master PBI", "Templates Operacionais Prontos", "Dashboard de Métricas"],
    bonus: ["Imersão Gravada: IA para Solopreneurs", "Comunidade VIP no WhatsApp", "Calculadora de Hora-Homem"],
    garantia: "30 Dias Incondicional + R$ 100 do próprio bolso se não economizar 10h/semana",
    cta: "Destravar Meu Sistema Operacional Agora",
    estrategiaPreco: "Ancorado de R$ 997 por 12x de R$ 29,70 ou R$ 297 à vista",
    modeloMonetizacao: "Low-Ticket com Esteira de Upsell para Consultoria",
  },
  funilProvavel: {
    tipo: "Funil Low-Ticket de Conversão Direta com Order Bump",
    leadMagnet: "Guia de 1 Página: As 5 Ferramentas Gratuitas de IA que Cortam 3 Horas de Trabalho Diário",
    orderBump: "Pack de 50 Prompts de Produtividade & Automação por R$ 27",
    upsell: "Acesso à Mentoria Mensal em Grupo por R$ 97/mês",
    downsell: "Versão Lite com Apenas os Templates por R$ 97",
  },
  estrategiaAquisicao: {
    angulosMarketing: [
      "O mito do 'trabalhe enquanto eles dormem' que está te falindo",
      "Como um consultor saiu de 14h para 5h de trabalho mantendo R$ 30k/mês",
      "O erro fatal ao organizar seu Notion que te faz perder vendas",
    ],
    gatilhosUtilizados: ["Prova Lógica", "Simplicidade Extrema", "Inimigo Comum (Complexidade)", "Garantia Reversa"],
    elementosProvaSocial: ["Prints de calendários limpos", "Depoimentos em vídeo de clientes faturando mais em menos tempo"],
  },
  diagnostico: {
    pontosFortes: [
      "Promessa muito tangível e alinhada com a dor de burnout do mercado",
      "Preço de entrada acessível com esteira de upsell bem posicionada",
    ],
    pontosFracos: [
      "Muitos concorrentes no nicho genérico de produtividade",
      "Página atual foca muito em ferramenta e pouco na transformação de negócio",
    ],
    oportunidadesDiferenciacao: [
      "Criar uma solução híbrida: E-book prático + Aplicativo Web de Rotina",
      "Reposicionar para nichos verticais ultra-específicos (ex: Médicos ou Advogados)",
      "Adicionar inteligência artificial nativa ao método",
    ],
  },
  score: {
    geral: 88,
    clarezaOferta: 92,
    forcaPromessa: 89,
    clarezaPublico: 90,
    diferenciacao: 82,
    potencialComercial: 94,
    estruturaFunil: 86,
    potencialRecorrencia: 85,
    potencialExpansao: 88,
    facilidadeCriacao: 90,
    potencialAquisicao: 84,
    parecerEstrategico: "Oferta madura com altíssimo potencial de escala. A grande oportunidade reside em encapsular o método em um Aplicativo / SaaS ou Produto Híbrido, elevando o LTV e a retenção.",
  },
};

const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: "op-demo-1",
    nomeProvisorio: "SoloOS — O Mini-SaaS de Gestão e Vendas para Profissionais Liberais",
    tagline: "A Central Operacional Tudo-em-Um que automatiza propostas, follow-up e tarefas diárias.",
    nicho: "Produtividade & SaaS B2B",
    subnicho: "Gestão Operacional para Prestadores de Serviço",
    publico: "Designers, programadores, consultores e advogados autônomos",
    problema: "Perda de propostas por falta de follow-up e desorganização financeira/tarefas",
    desejo: "Um painel limpo que lembre os contatos e gere contratos em 2 cliques",
    solucaoProposta: "Mini-aplicativo web conectado ao WhatsApp que gerencia clientes e tarefas com IA",
    mecanismoUnico: "Pipeline Cognitivo de Conversão Rápida",
    diferencial: "Zero curva de aprendizado: funciona direto no navegador ou celular em 5 minutos",
    formatoRecomendado: "SaaS + Landing Page + Área de Membros",
    modeloMonetizacao: "Assinatura Recorrente (R$ 49 a R$ 97/mês)",
    faixaPrecoSugerida: "R$ 49/mês ou R$ 397/ano",
    complexidade: "Média",
    potencialExpansao: "Adicionar emissão de notas e cobranças automáticas via PIX",
    justificativaEstrategica: "Transforma a dor de produtividade em software recorrente com altíssimo LTV e baixo churn.",
    anguloInovacao: "Substituir 4 ferramentas caras por 1 painel minimalista com IA",
  },
  {
    id: "op-demo-2",
    nomeProvisorio: "Desafio 14 Dias: Rotina de 4 Horas com IA",
    tagline: "O protocolo prático de reprogramação diária para dobrar a receita trabalhando a metade.",
    nicho: "Educação & Alta Performance",
    subnicho: "Rotina e Automação Pessoal com IA",
    publico: "Empreendedores digitais que se sentem escravos do próprio negócio",
    problema: "Exaustão mental e sensação de estagnação mesmo trabalhando o dia inteiro",
    desejo: "Fazer o que realmente gera caixa antes das 11h da manhã e ter as tardes livres",
    solucaoProposta: "E-book interativo com plano de ação diário de 14 dias + 14 checklists operacionais",
    mecanismoUnico: "Método dos 3 Blocos Inegociáveis",
    diferencial: "Acompanhamento com bot de WhatsApp que cobra as metas diárias",
    formatoRecomendado: "E-book + Comunidade + Order Bump",
    modeloMonetizacao: "Low-Ticket com alta margem e esteira de produtos",
    faixaPrecoSugerida: "R$ 47 a R$ 97",
    complexidade: "Baixa",
    potencialExpansao: "Evoluir para mentoria em grupo e imersão presencial",
    justificativaEstrategica: "Produto de entrada com baixíssimo custo de aquisição (CAC) e apelo viral imediato.",
    anguloInovacao: "Foco exclusivo em automação de tarefas chatas usando prompts prontos de IA",
  },
  {
    id: "op-demo-3",
    nomeProvisorio: "Agência em 1 Hora: Kit de Propostas e Fechamentos",
    tagline: "O acervo blindado de scripts, contratos e calculadoras de precificação lucrativa.",
    nicho: "Vendas & Negócios",
    subnicho: "Fechamento de Clientes High-Ticket",
    publico: "Freelancers que cobram barato e têm medo de negociar",
    problema: "Propostas ignoradas e clientes pedindo desconto a todo momento",
    desejo: "Fechar contratos de 3 a 5 dígitos com autoridade instantânea",
    solucaoProposta: "Microsite interativo com gerador de propostas comerciais e scripts de objeções",
    mecanismoUnico: "Matriz de Valor Irrecusável",
    diferencial: "Calculadora automática de precificação baseada no ROI do cliente",
    formatoRecomendado: "Microsite + Templates + Comunidade",
    modeloMonetizacao: "Pagamento Único + Atualizações Anuais",
    faixaPrecoSugerida: "R$ 147 a R$ 297",
    complexidade: "Baixa",
    potencialExpansao: "Clube fechado de indicação de leads e parcerias",
    justificativaEstrategica: "Atinge o ponto mais sensível de qualquer prestador de serviços: fechamento de vendas.",
    anguloInovacao: "Modelos dinâmicos preenchíveis na web em vez de PDFs estáticos",
  },
  {
    id: "op-demo-4",
    nomeProvisorio: "Clube da Execução Enxuta (Comunidade VIP & Sprints)",
    tagline: "Encontros semanais de co-working silencioso e prestação de contas com mentores.",
    nicho: "Comunidade & Network",
    subnicho: "Accountability para Empreendedores Solitários",
    publico: "Criadores e fundadores que trabalham em home office",
    problema: "Solidão e procrastinação crônica por falta de cobrança externa",
    desejo: "Estar em uma sala com pessoas no mesmo nível executando em alta velocidade",
    solucaoProposta: "Área de membros com sprints quinzenais de foco e ranking de produtividade",
    mecanismoUnico: "Sprint de Foco Imersivo (Protocolo 50/10)",
    diferencial: "Monitoramento de hábitos em tempo real com recompensas",
    formatoRecomendado: "Área de membros + Comunidade",
    modeloMonetizacao: "Mensalidade / Assinatura Trimestral",
    faixaPrecoSugerida: "R$ 67/mês",
    complexidade: "Média",
    potencialExpansao: "Parcerias com marcas de tecnologia e ferramentas",
    justificativaEstrategica: "Receita recorrente altamente previsível com efeito de rede.",
    anguloInovacao: "Foco 100% em execução conjunta e 0% em aulas teóricas longas",
  },
  {
    id: "op-demo-5",
    nomeProvisorio: "DeepFocus AI: Extensão e App de Blindagem de Foco",
    tagline: "O assistente inteligente que bloqueia distrações e organiza seu fluxo de trabalho por prioridade de faturamento.",
    nicho: "Software & Produtividade",
    subnicho: "Extensões Chrome e Apps Desktop",
    publico: "Profissionais que perdem horas no YouTube, WhatsApp Web e redes sociais",
    problema: "Interrupções constantes que quebram o estado de flow criativo",
    desejo: "Conseguir focar por 90 minutos ininterruptos na tarefa mais importante",
    solucaoProposta: "Software desktop/web com modo 'Foco Profundo' e trilhas de áudio binaurais",
    mecanismoUnico: "Barreira de Dopamina Reversa",
    diferencial: "Integração nativa com inteligência artificial para resumir emails e filtrar urgências",
    formatoRecomendado: "Aplicativo + SaaS + Microsite",
    modeloMonetizacao: "Freemium com plano Pro a R$ 29/mês",
    faixaPrecoSugerida: "R$ 29 a R$ 59/mês",
    complexidade: "Alta",
    potencialExpansao: "Planos empresariais para equipes remotas",
    justificativaEstrategica: "Alta retenção diária (software de uso indispensável na rotina de trabalho).",
    anguloInovacao: "Combinação de bloqueador estrito com gerador de foco sonoro adaptativo",
  },
];

const SAMPLE_MASTER_PROJECT: MasterProject = {
  id: "proj-demo-master-1",
  nomeProduto: "SoloOS — O Sistema Operacional & SaaS de Vendas para Profissionais Liberais",
  slug: "solo-os-vendas",
  nicho: "Produtividade & SaaS B2B",
  subnicho: "Gestão Operacional & Automação de Vendas para Solopreneurs",
  bigIdea: "Você não precisa de 10 softwares caros nem de trabalhar 14h por dia para ter uma operação digital lucrativa: você só precisa de um Sistema Operacional Enxuto com IA.",
  posicionamento: "A única plataforma minimalista que elimina o caos de tarefas e garante follow-up de clientes no automático, criada especificamente para quem trabalha sozinho.",
  propostaUnicaValor: "Centralize seus clientes, propostas e rotina em um único painel inteligente que dobra seu fechamento de vendas em menos de 15 minutos por dia.",
  mecanismoUnico: {
    nome: "Pipeline Cognitivo de Conversão Rápida (PCCR)",
    explicacao: "Um algoritmo simples de 3 etapas que prioriza automaticamente os clientes mais quentes e agenda mensagens de follow-up no momento exato de maior probabilidade de compra.",
  },
  promessaPrincipal: "Dobre sua taxa de fechamento de propostas e recupere 15 horas livres na sua semana nos próximos 14 dias.",
  promessasSecundarias: [
    "Nunca mais perca um cliente em potencial por esquecer de responder ou enviar proposta",
    "Automatize a cobrança e o envio de contratos sem parecer desesperado ou chato",
    "Tenha clareza total de quanto vai faturar no mês sem planilhas confusas",
  ],
  avatar: {
    nome: "Rodrigo — O Profissional Autônomo Sobrecarregado",
    perfilDemografico: "Homem ou mulher de 26 a 48 anos, designer, desenvolvedor, consultor, copywriter ou gestor de tráfego, faturando de R$ 5k a R$ 25k/mês.",
    momentoVidaContexto: "Trabalha de casa ou escritório compartilhado, cuida de tudo sozinho (vendas, entrega, financeiro, suporte) e está à beira do esgotamento.",
    doresProfundas: [
      "Sensação de que o negócio morre se ele parar de trabalhar por 2 dias",
      "Vergonha de demorar para responder clientes e perder contratos fáceis",
      "Angústia no fim do mês sem saber de onde virão os próximos clientes",
    ],
    desejosSecretos: [
      "Ter uma empresa que parece uma agência estruturada de 10 pessoas, mas rodando no automático",
      "Poder tirar férias de 15 dias sem o celular tocando com clientes irritados",
      "Ser respeitado no mercado e cobrar preços altos sem desconto",
    ],
    medosInconfessaveis: [
      "Ter que voltar para um emprego CLT humilhante se não conseguir organizar as contas",
      "Decepcionar a família por passar o dia no computador sem tempo de qualidade",
    ],
    principaisObjecoes: [
      "Não tenho tempo para configurar um sistema do zero",
      "Já tentei Notion, Trello, Asana e sempre acabo abandonando",
      "Não entendo nada de programação ou automações complexas",
    ],
    inimigoComum: "Os 'monstros de software' hiper-complexos que exigem 40 horas de tutoriais e mais atrapalham do que vendem.",
    linguagemETermoChave: [
      "Gargalo de tempo",
      "Fechamento de propostas",
      "Follow-up de WhatsApp",
      "Operação enxuta",
      "Paz de espírito",
      "Fluxo de caixa previsível",
    ],
  },
  oferta: {
    nomeOferta: "Acesso Vitalício SoloOS + Pack de Aceleração de Vendas com IA",
    precoPrincipal: "R$ 197 à vista ou 12x de R$ 19,70",
    modeloMonetizacao: "Pagamento Único de Acesso Vitalício (com upsell de plano Cloud Pro)",
    ancoragem: "Menos que o valor de um único almoço de negócios para resolver sua operação pelo ano inteiro.",
    garantia: "30 Dias de Garantia Blindada: Se não fechar pelo menos 1 novo cliente com o sistema, devolvemos 100% do valor.",
    urgencia: "Oferta de Lançamento da Versão 2.0 com vagas limitadas para o servidor prioritário.",
    escassezEtica: "O bônus de Imersão ao Vivo com o criador é reservado apenas para os primeiros 100 inscritos.",
    ctaPrincipal: "Quero Destravar Meu SoloOS e Dobrar Meus Fechamentos",
    bonusExclusivos: [
      {
        titulo: "Bônus #1: Acervo de 25 Modelos de Propostas Irrecusáveis",
        valorPercebido: "R$ 197",
        descricao: "Templates prontos no formato web que os clientes assinam e pagam no PIX em minutos.",
      },
      {
        titulo: "Bônus #2: Sequências de Follow-up Magnético no WhatsApp",
        valorPercebido: "R$ 147",
        descricao: "As exatas 7 mensagens que ressuscitam clientes que pararam de responder.",
      },
      {
        titulo: "Bônus #3: Calculadora de Precificação com Margem de Lucro",
        valorPercebido: "R$ 97",
        descricao: "Descubra exatamente quanto cobrar pela sua hora para bater R$ 20.000/mês com tranquilidade.",
      },
    ],
  },
  formatosEscolhidos: ["SaaS", "Landing Page", "Área de membros", "E-book"],
  tomDeVoz: "Autoritário, direto, empático e focado em ROI financeiro imediato.",
  estrategiaFunil: {
    modeloPrincipal: "Funil Low-Ticket de Alta Conversão com Esteira de Upsell",
    resumoEtapas: [
      "Anúncio no Instagram focado na dor de perder propostas",
      "Landing page de alta conversão com vídeo demonstrativo de 2 minutos",
      "Checkout otimizado com Order Bump de R$ 27 (Pack de Prompts de Fechamento)",
      "Página de Upsell 1-Click: Imersão VIP de Automação de Agência por R$ 297",
      "Downsell: Acesso à gravação da mentoria por R$ 97",
      "Acesso imediato à plataforma e grupo de boas-vindas",
    ],
    sugestaoOrderBump: "Pack com 100 Scripts de Fechamento de Vendas por WhatsApp — R$ 27",
    sugestaoUpsell: "Mentoria de Escala para Prestadores de Serviço (4 Encontros ao Vivo) — R$ 497",
    sugestaoDownsell: "Kit de Contratos Jurídicos Blindados para Prestadores — R$ 67",
  },
  regrasMemoria: [
    "Sempre enfatizar a simplicidade extrema e o tempo de configuração menor que 10 minutos.",
    "Nunca fazer promessas de ganhos fáceis sem trabalho; o foco é organização e aumento de conversão.",
    "O avatar principal é quem trabalha sozinho (solopreneur / prestador de serviço), não grandes corporações.",
    "O tom deve ser de profissional para profissional, sem jargões corporativos vazios.",
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const StorageService = {
  getProjects(): MasterProject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (!data) {
        const initial = [SAMPLE_MASTER_PROJECT];
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return [SAMPLE_MASTER_PROJECT];
    }
  },

  saveProject(project: MasterProject): void {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      projects[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.unshift({ ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  deleteProject(id: string): void {
    const projects = this.getProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  getActiveProjectId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT_ID) || SAMPLE_MASTER_PROJECT.id;
  },

  setActiveProjectId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, id);
  },

  setActiveProject(id: string): MasterProject | null {
    this.setActiveProjectId(id);
    return this.getActiveProject();
  },

  getActiveProject(): MasterProject {
    const id = this.getActiveProjectId();
    const projects = this.getProjects();
    return projects.find((p) => p.id === id) || projects[0] || SAMPLE_MASTER_PROJECT;
  },

  getLatestAnalysis(): OfferAnalysis {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANALYSES);
      return data ? JSON.parse(data) : SAMPLE_ANALYSIS;
    } catch {
      return SAMPLE_ANALYSIS;
    }
  },

  saveAnalysis(analysis: OfferAnalysis): void {
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(analysis));
  },

  saveLatestAnalysis(analysis: OfferAnalysis): void {
    this.saveAnalysis(analysis);
  },

  getOpportunities(): Opportunity[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
      return data ? JSON.parse(data) : SAMPLE_OPPORTUNITIES;
    } catch {
      return SAMPLE_OPPORTUNITIES;
    }
  },

  saveOpportunities(opps: Opportunity[]): void {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
  },

  // Project Memory Facts
  getMemoryFacts(projectId: string): ProjectMemoryFact[] {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.MEMORY_FACTS);
      const list: ProjectMemoryFact[] = all ? JSON.parse(all) : [];
      const projectFacts = list.filter((f) => f.id.startsWith(projectId));
      if (projectFacts.length === 0) {
        const project = this.getActiveProject();
        const defaultFacts: ProjectMemoryFact[] = [
          {
            id: `${project.id}-fact-1`,
            chave: "Avatar Principal",
            valor: project.avatar?.nome || "Rodrigo - Solopreneur sobrecarregado",
            categoria: "avatar",
            status: "aprovado",
            atualizadoEm: new Date().toISOString(),
          },
          {
            id: `${project.id}-fact-2`,
            chave: "Mecanismo Único",
            valor: `${project.mecanismoUnico?.nome}: ${project.mecanismoUnico?.explicacao}`,
            categoria: "mecanismo",
            status: "aprovado",
            atualizadoEm: new Date().toISOString(),
          },
          {
            id: `${project.id}-fact-3`,
            chave: "Promessa Central",
            valor: project.promessaPrincipal,
            categoria: "posicionamento",
            status: "aprovado",
            atualizadoEm: new Date().toISOString(),
          },
          {
            id: `${project.id}-fact-4`,
            chave: "Regra de Ouro",
            valor: "Simplicidade extrema: configurar em menos de 10 minutos sem tutoriais chatos.",
            categoria: "regra_inviolavel",
            status: "aprovado",
            atualizadoEm: new Date().toISOString(),
          },
        ];
        return defaultFacts;
      }
      return projectFacts;
    } catch {
      return [];
    }
  },

  saveMemoryFact(fact: ProjectMemoryFact): void {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.MEMORY_FACTS);
      let list: ProjectMemoryFact[] = all ? JSON.parse(all) : [];
      const idx = list.findIndex((f) => f.id === fact.id);
      if (idx >= 0) {
        list[idx] = fact;
      } else {
        list.push(fact);
      }
      localStorage.setItem(STORAGE_KEYS.MEMORY_FACTS, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  },

  deleteMemoryFact(id: string): void {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.MEMORY_FACTS);
      if (!all) return;
      const list: ProjectMemoryFact[] = JSON.parse(all);
      const filtered = list.filter((f) => f.id !== id);
      localStorage.setItem(STORAGE_KEYS.MEMORY_FACTS, JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  },

  // Telemetry & Internal Beta logs
  getTelemetryLogs(): TelemetryLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TELEMETRY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getTelemetry(): TelemetryLog[] {
    return this.getTelemetryLogs();
  },

  clearTelemetry(): void {
    localStorage.removeItem(STORAGE_KEYS.TELEMETRY);
  },

  logTelemetry(log: Omit<TelemetryLog, "id" | "timestamp">): void {
    try {
      const logs = this.getTelemetryLogs();
      const newLog: TelemetryLog = {
        ...log,
        id: "log-" + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      };
      logs.unshift(newLog);
      localStorage.setItem(STORAGE_KEYS.TELEMETRY, JSON.stringify(logs.slice(0, 100)));
    } catch (e) {
      console.error(e);
    }
  },

  updateFeedback(logId: string, feedback: "👍" | "👎" | "⭐" | "✏️" | "🔄"): void {
    try {
      const logs = this.getTelemetryLogs();
      const idx = logs.findIndex((l) => l.id === logId);
      if (idx >= 0) {
        logs[idx].feedback = feedback;
        localStorage.setItem(STORAGE_KEYS.TELEMETRY, JSON.stringify(logs));
      }
    } catch (e) {
      console.error(e);
    }
  },

  // Generated Assets Cache per Project
  getAsset<T>(type: string, projectId: string): T | null {
    try {
      const key = `${type}_${projectId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveAsset<T>(type: string, projectId: string, asset: T): void {
    try {
      const key = `${type}_${projectId}`;
      localStorage.setItem(key, JSON.stringify(asset));
    } catch (e) {
      console.error(e);
    }
  },

  // Export / Import Full Database Backup
  exportDatabaseJSON(): string {
    const backup: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("cv_ia_") || key.includes("proj-"))) {
        backup[key] = localStorage.getItem(key);
      }
    }
    return JSON.stringify(backup, null, 2);
  },

  exportAllData(): string {
    return this.exportDatabaseJSON();
  },

  importDatabaseJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === "string") {
          localStorage.setItem(key, value);
        }
      }
      return true;
    } catch {
      return false;
    }
  },

  importAllData(jsonStr: string): boolean {
    return this.importDatabaseJSON(jsonStr);
  },
};
