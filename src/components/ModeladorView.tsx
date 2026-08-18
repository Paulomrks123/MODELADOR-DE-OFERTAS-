import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Globe,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Target,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  BookOpen,
  DollarSign,
  Share2,
  Copy,
  Check,
  Clipboard,
  Trash2,
} from "lucide-react";
import { OfferAnalysis } from "../types";
import { ApiService } from "../lib/api";

interface ModeladorViewProps {
  analysis: OfferAnalysis;
  initialUrl?: string;
  onAnalysisComplete: (newAnalysis: OfferAnalysis) => void;
  onProceedToOpportunities: () => void;
}

export const ModeladorView: React.FC<ModeladorViewProps> = ({
  analysis,
  initialUrl = "",
  onAnalysisComplete,
  onProceedToOpportunities,
}) => {
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [contextNotes, setContextNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialUrl && initialUrl !== urlInput) {
      setUrlInput(initialUrl);
      triggerAnalysis(initialUrl, "");
    }
  }, [initialUrl]);

  const presetExamples = [
    {
      title: "Página de Curso & Mentoria",
      url: "https://exemplo.com.br/mentoria-alta-renda-vendas",
      notes: "Curso online focado em vendas B2B e fechamento de contratos de 5 dígitos para consultores e agências.",
    },
    {
      title: "SaaS de Gestão / Micro-Tool",
      url: "https://exemplo.com.br/saas-automacao-whatsapp",
      notes: "Software de disparo e gerenciamento de funis no WhatsApp para e-commerce e afiliados.",
    },
    {
      title: "E-book & Desafio Low-Ticket",
      url: "https://exemplo.com.br/desafio-14-dias-foco-total",
      notes: "Produto de R$ 47 com order bump de prompts e esteira para comunidade de hábitos.",
    },
    {
      title: "Comunidade & Área de Membros",
      url: "https://exemplo.com.br/clube-criadores-conteudo",
      notes: "Área de membros por assinatura mensal com encontros semanais de networking e templates.",
    },
  ];

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
      }
    } catch {
      // ignore
    }
  };

  const triggerAnalysis = async (urlToUse: string, notesToUse: string) => {
    if (!urlToUse.trim() && !notesToUse.trim()) {
      setErrorMessage("Por favor, insira uma URL ou descreva a oferta de referência.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setLoadingStage("Acessando dados públicos da página e verificando estrutura...");

    try {
      let extractedContent = "";
      if (urlToUse.trim().startsWith("http")) {
        const fetchRes = await ApiService.fetchUrlContent(urlToUse.trim());
        if (fetchRes.extractedText) {
          extractedContent = fetchRes.extractedText;
        }
      }

      setLoadingStage("Executando engenharia reversa & análise estratégica com IA...");
      const result = await ApiService.analyzeOffer({
        url: urlToUse.trim(),
        rawContent: extractedContent,
        contextNotes: notesToUse.trim(),
      });

      if (result && result.analysis) {
        let finalAnalysis = { ...result.analysis, sourceUrl: urlToUse.trim() };

        // If oportunidades is missing or empty, generate them automatically based on the URL
        if (!finalAnalysis.oportunidades || finalAnalysis.oportunidades.length === 0) {
          setLoadingStage("Gerando 5 oportunidades de produtos inovadores baseadas na URL informada...");
          try {
            const oppsRes = await ApiService.generateOpportunities({
              analysis: finalAnalysis,
              url: urlToUse.trim(),
            });
            if (oppsRes && oppsRes.opportunities && oppsRes.opportunities.length > 0) {
              finalAnalysis.oportunidades = oppsRes.opportunities;
            }
          } catch (e) {
            console.warn("Auto opportunity generation non-blocking error:", e);
          }
        }

        onAnalysisComplete(finalAnalysis);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Erro ao analisar oferta. Verifique a URL ou forneça mais contexto.");
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  const handleAnalyze = () => {
    triggerAnalysis(urlInput, contextNotes);
  };

  const handleCopyAnalysis = () => {
    navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner & Primary Modeling Field */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span>ETAPA 1 — MODELAR OFERTA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
            Insira a URL da oferta para começar a modelagem estratégica
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Aceita landing pages, páginas de vendas, páginas de captura, páginas de checkout, e-books e ofertas
            públicas. A IA faz a engenharia reversa de estruturas, dores e mecanismos sem copiar marcas ou materiais protegidos.
          </p>
        </div>

        {/* Core Input Form */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 flex items-center bg-zinc-950 rounded-xl border border-zinc-800 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <Globe className="w-5 h-5 text-emerald-400 absolute left-4 pointer-events-none" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                placeholder="https://exemplo.com.br/pagina-de-vendas"
                className="w-full pl-12 pr-24 py-3.5 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
              />
              <div className="absolute right-3 flex items-center gap-1.5">
                {urlInput ? (
                  <button
                    type="button"
                    onClick={() => setUrlInput("")}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                    title="Limpar URL"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1 transition-colors"
                    title="Colar da Área de Transferência"
                  >
                    <Clipboard className="w-3 h-3 text-emerald-400" />
                    <span>Colar</span>
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Modelando Oferta...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-zinc-950" />
                  <span>Começar a Modelagem</span>
                </>
              )}
            </button>
          </div>

          {/* Optional context field */}
          <div className="pt-1">
            <textarea
              value={contextNotes}
              onChange={(e) => setContextNotes(e.target.value)}
              placeholder="Notas adicionais ou resumo da oferta (opcional, útil caso queira orientar o foco da análise)..."
              rows={2}
              className="w-full p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 focus:border-zinc-700 text-xs text-zinc-300 placeholder-zinc-500 outline-none resize-none"
            />
          </div>

          {/* Preset 1-Click Examples */}
          <div className="pt-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">
              Ou escolha um modelo de teste:
            </span>
            <div className="flex flex-wrap gap-2">
              {presetExamples.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUrlInput(ex.url);
                    setContextNotes(ex.notes);
                    triggerAnalysis(ex.url, ex.notes);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 text-xs text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{ex.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Progress Notification */}
        {loading && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 animate-pulse">
            <Loader2 className="w-5 h-5 text-emerald-400 animate-spin shrink-0" />
            <div>
              <p className="text-xs font-semibold text-emerald-300">{loadingStage}</p>
              <p className="text-[11px] text-emerald-400/80">
                A IA está dissecando o avatar, mecanismo de oferta, funil e gerando o Score de 10 pilares.
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Bar with Score & Next Step CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex flex-col items-center justify-center shrink-0">
                <span className="text-2xl font-black text-emerald-400">{analysis.score?.geral || 85}</span>
                <span className="text-[9px] font-mono uppercase text-emerald-300/80">SCORE</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-100">Diagnóstico Estratégico Concluído</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Nicho: <span className="text-zinc-200 font-medium">{analysis.nicho}</span> • Subnicho:{" "}
                  <span className="text-zinc-200 font-medium">{analysis.subnicho}</span>
                </p>
                {urlInput && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-400 font-mono">
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate max-w-[280px] sm:max-w-md" title={urlInput}>
                      {urlInput}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleCopyAnalysis}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors cursor-pointer"
                title="Copiar JSON da Análise"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copiado!" : "Copiar Dados"}</span>
              </button>
              <button
                onClick={onProceedToOpportunities}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Ver as 5 Oportunidades Criadas da URL</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 10 Score Pillars Visualizer */}
          <div className="p-6 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-zinc-200">Score da Oferta (0 a 100) — 10 Pilares Analíticos</h3>
              </div>
              <span className="text-xs text-zinc-400">Score Geral: {analysis.score?.geral}/100</span>
            </div>

            <p className="text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80 italic leading-relaxed">
              "{analysis.score?.parecerEstrategico}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {[
                { label: "Clareza da Oferta", score: analysis.score?.clarezaOferta },
                { label: "Força da Promessa", score: analysis.score?.forcaPromessa },
                { label: "Clareza do Público", score: analysis.score?.clarezaPublico },
                { label: "Diferenciação", score: analysis.score?.diferenciacao },
                { label: "Potencial Comercial", score: analysis.score?.potencialComercial },
                { label: "Estrutura do Funil", score: analysis.score?.estruturaFunil },
                { label: "Recorrência", score: analysis.score?.potencialRecorrencia },
                { label: "Potencial de Expansão", score: analysis.score?.potencialExpansao },
                { label: "Facilidade de Criação", score: analysis.score?.facilidadeCriacao },
                { label: "Potencial de Aquisição", score: analysis.score?.potencialAquisicao },
              ].map((p, idx) => {
                const val = p.score || 80;
                return (
                  <div key={idx} className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-zinc-400 truncate pr-1">{p.label}</span>
                      <span
                        className={`font-mono font-bold ${
                          val >= 85 ? "text-emerald-400" : val >= 70 ? "text-amber-400" : "text-red-400"
                        }`}
                      >
                        {val}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          val >= 85 ? "bg-emerald-400" : val >= 70 ? "bg-amber-400" : "bg-red-400"
                        }`}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deep Strategic Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Publico, Avatar & Dores */}
            <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                <Target className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Avatar & Dores</h4>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-400">Público-Alvo:</span>
                <p className="text-xs text-zinc-200 mt-0.5">{analysis.publicoAlvo}</p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-400">Perfil do Avatar:</span>
                <p className="text-xs text-zinc-300 mt-0.5">{analysis.avatar?.perfil}</p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-400">Principais Dores:</span>
                <ul className="mt-1 space-y-1">
                  {analysis.avatar?.dores?.map((d, i) => (
                    <li key={i} className="text-xs text-zinc-300 flex items-start gap-1.5">
                      <span className="text-red-400 shrink-0">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-400">Desejos & Transformação:</span>
                <p className="text-xs text-emerald-300 mt-0.5 font-medium">{analysis.transformacaoPrometida}</p>
              </div>
            </div>

            {/* Column 2: Mecanismo, Proposta & Oferta */}
            <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Mecanismo & Oferta</h4>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-400">Problema Principal:</span>
                <p className="text-xs text-zinc-200 mt-0.5">{analysis.problemaPrincipal}</p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-400">Mecanismo da Oferta:</span>
                <p className="text-xs text-amber-300 mt-0.5 font-semibold">{analysis.mecanismoOferta}</p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-400">Proposta de Valor:</span>
                <p className="text-xs text-zinc-300 mt-0.5">{analysis.propostaValor}</p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-400">Estratégia de Preço & Monetização:</span>
                <p className="text-xs text-zinc-200 mt-0.5">
                  {analysis.estruturaOferta?.estrategiaPreco} ({analysis.estruturaOferta?.modeloMonetizacao})
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-400">Garantia & CTA:</span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {analysis.estruturaOferta?.garantia} • CTA: "{analysis.estruturaOferta?.cta}"
                </p>
              </div>
            </div>

            {/* Column 3: Funil & Oportunidades de Diferenciação */}
            <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Funil & Diferenciais</h4>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-400">Funil Provável:</span>
                <p className="text-xs text-zinc-200 mt-0.5">{analysis.funilProvavel?.tipo}</p>
                <div className="mt-1 space-y-0.5 text-[11px] text-zinc-400 font-mono">
                  {analysis.funilProvavel?.leadMagnet && <div>Lead: {analysis.funilProvavel.leadMagnet}</div>}
                  {analysis.funilProvavel?.orderBump && <div>Bump: {analysis.funilProvavel.orderBump}</div>}
                  {analysis.funilProvavel?.upsell && <div>Upsell: {analysis.funilProvavel.upsell}</div>}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-400">Pontos Fortes:</span>
                <ul className="mt-1 space-y-1 text-xs text-zinc-300">
                  {analysis.diagnostico?.pontosFortes?.map((pf, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">✓</span> <span>{pf}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-400">Oportunidades de Diferenciação:</span>
                <ul className="mt-1 space-y-1 text-xs text-emerald-300 font-medium">
                  {analysis.diagnostico?.oportunidadesDiferenciacao?.map((od, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">★</span> <span>{od}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
