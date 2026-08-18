import React, { useState, useEffect } from "react";
import {
  Feather,
  Sparkles,
  Loader2,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Star,
  RefreshCw,
  Edit3,
  HelpCircle,
  Zap,
  Target,
  Shield,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { MasterProject, CopywritingHub } from "../types";
import { ApiService } from "../lib/api";
import { StorageService } from "../lib/storage";

interface CopywritingViewProps {
  project: MasterProject;
}

export const CopywritingView: React.FC<CopywritingViewProps> = ({ project }) => {
  const [loading, setLoading] = useState(false);
  const [copyData, setCopyData] = useState<CopywritingHub | null>(null);
  const [activeTab, setActiveTab] = useState<
    "headlines" | "subheadlines" | "ctas" | "bullets" | "objecoes" | "provas" | "micro"
  >("headlines");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check if project has cached copy asset
    const cached = StorageService.getAsset<CopywritingHub>("copywriting", project.id);
    if (cached) {
      setCopyData(cached);
    } else {
      handleGenerate();
    }
  }, [project.id]);

  const handleGenerate = async (targetModule?: string) => {
    setLoading(true);
    try {
      const res = await ApiService.generateCopywriting({
        masterProject: project,
        targetModule,
      });
      if (res && res.copywriting) {
        setCopyData(res.copywriting);
        StorageService.saveAsset("copywriting", project.id, res.copywriting);
      }
    } catch (err: any) {
      console.error(err);
      alert("Erro ao gerar copy: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFeedback = (itemKey: string, type: "👍" | "👎" | "⭐") => {
    setFeedbackState((prev) => ({ ...prev, [itemKey]: type }));
    StorageService.logTelemetry({
      endpoint: "/api/generate-copywriting",
      duracaoMs: 0,
      status: "sucesso",
      feedback: type,
      notas: `Item: ${itemKey}`,
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <span>ETAPA 4 — CENTRAL DE COPYWRITING</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Geradores de Copywriting de Alta Conversão
            </h1>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Copywriting de elite moldado pelo Projeto-Mestre de <strong className="text-zinc-200">{project.nomeProduto}</strong>.
              Todas as peças respeitam o avatar <strong className="text-zinc-200">{project.avatar?.nome}</strong> e o mecanismo <strong className="text-zinc-200">{project.mecanismoUnico?.nome}</strong>.
            </p>
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-zinc-950" /> : <RefreshCw className="w-4 h-4 text-zinc-950" />}
            <span>{loading ? "Gerando Copies..." : "Regenerar Central de Copy"}</span>
          </button>
        </div>
      </div>

      {/* Copy Modules Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
        {[
          { id: "headlines", label: "1. Headlines (7 Ângulos)" },
          { id: "subheadlines", label: "2. Subheadlines" },
          { id: "ctas", label: "3. CTAs Persuasivos" },
          { id: "bullets", label: "4. Bullets de Fascínio" },
          { id: "objecoes", label: "5. Quebra de Objeções" },
          { id: "provas", label: "6. Provas & Argumentos" },
          { id: "micro", label: "7. Micro-Copies & Badges" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm font-semibold text-zinc-200">Produzindo copy persuasiva com a inteligência do Projeto-Mestre...</p>
          <p className="text-xs text-zinc-500">Mapeando dores profundas, promessas e mecanismos de alta conversão.</p>
        </div>
      )}

      {/* Content Rendering based on Active Tab */}
      {!loading && copyData && (
        <div className="space-y-6">
          {/* TAB 1: HEADLINES */}
          {activeTab === "headlines" && (
            <div className="space-y-6">
              {[
                { title: "Headlines Diretas (Alta Intenção)", list: copyData.headlines.diretas, icon: Zap, tag: "Direta" },
                { title: "Headlines de Curiosidade & Mecanismo", list: copyData.headlines.curiosidade, icon: Target, tag: "Curiosidade" },
                { title: "Headlines de Benefício & ROI Imediato", list: copyData.headlines.beneficio, icon: Sparkles, tag: "Benefício" },
                { title: "Headlines de Problema & Identificação de Dor", list: copyData.headlines.problema, icon: Shield, tag: "Problema" },
                { title: "Headlines de Transformação de Vida", list: copyData.headlines.transformacao, icon: Star, tag: "Transformação" },
                { title: "Headlines Específicas com Números/Tempo", list: copyData.headlines.especificas, icon: Layers, tag: "Específica" },
                { title: "Headlines para Anúncios (Meta Ads / Feed)", list: copyData.headlines.anuncios, icon: Feather, tag: "Anúncios" },
              ].map((category, catIdx) => (
                <div key={catIdx} className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <category.icon className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-zinc-200">{category.title}</h3>
                  </div>

                  <div className="space-y-2">
                    {category.list?.map((headline, idx) => {
                      const itemKey = `hl-${catIdx}-${idx}`;
                      const isCopied = copiedKey === itemKey;
                      return (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                        >
                          <p className="text-xs text-zinc-200 font-medium leading-relaxed flex-1">"{headline}"</p>
                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => copyToClipboard(headline, itemKey)}
                              className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                              title="Copiar Headline"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleFeedback(itemKey, "👍")}
                              className={`p-1.5 rounded-md transition-colors ${
                                feedbackState[itemKey] === "👍" ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
                              }`}
                              title="Aprovar"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleFeedback(itemKey, "⭐")}
                              className={`p-1.5 rounded-md transition-colors ${
                                feedbackState[itemKey] === "⭐" ? "bg-amber-500/20 text-amber-400" : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
                              }`}
                              title="Favoritar"
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SUBHEADLINES */}
          {activeTab === "subheadlines" && (
            <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-4">
              <h3 className="text-sm font-bold text-zinc-200">Subheadlines de Apoio & Expansão de Promessa</h3>
              <div className="space-y-3">
                {copyData.subheadlines?.map((sub, idx) => {
                  const itemKey = `sub-${idx}`;
                  const isCopied = copiedKey === itemKey;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-4 p-4 rounded-lg bg-zinc-950/70 border border-zinc-800/80"
                    >
                      <p className="text-xs text-zinc-300 leading-relaxed flex-1">{sub}</p>
                      <button
                        onClick={() => copyToClipboard(sub, itemKey)}
                        className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1.5 shrink-0"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? "Copiado!" : "Copiar"}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CTAs */}
          {activeTab === "ctas" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "CTAs Diretos & Fortes", list: copyData.ctas.diretos },
                { title: "CTAs com Benefício Acoplado", list: copyData.ctas.comBeneficio },
                { title: "CTAs com Urgência & Escassez", list: copyData.ctas.comUrgencia },
                { title: "CTAs de Baixo Atrito / Micro-Ação", list: copyData.ctas.baixoAtrito },
              ].map((group, gIdx) => (
                <div key={gIdx} className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">{group.title}</h3>
                  <div className="space-y-2">
                    {group.list?.map((cta, idx) => {
                      const itemKey = `cta-${gIdx}-${idx}`;
                      const isCopied = copiedKey === itemKey;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800/80"
                        >
                          <span className="text-xs font-bold text-zinc-200">{cta}</span>
                          <button
                            onClick={() => copyToClipboard(cta, itemKey)}
                            className="text-zinc-500 hover:text-emerald-400 p-1"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: BULLETS PERSUASIVOS */}
          {activeTab === "bullets" && (
            <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-4">
              <h3 className="text-sm font-bold text-zinc-200">Bullets de Fascínio (Fascinations)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {copyData.bulletsPersuasivos?.map((bullet, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{bullet.icone || "✦"}</span>
                      <h4 className="text-xs font-bold text-emerald-300">{bullet.fascinio}</h4>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{bullet.explicacao}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: QUEBRA DE OBJEÇÕES */}
          {activeTab === "objecoes" && (
            <div className="space-y-4">
              {copyData.quebraObjecoes?.map((obj, idx) => {
                const itemKey = `obj-${idx}`;
                const isCopied = copiedKey === itemKey;
                return (
                  <div key={idx} className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-bold text-zinc-200">Objeção: "{obj.objecao}"</h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        Técnica: {obj.tecnica}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800/80 leading-relaxed italic">
                      "{obj.respostaCopy}"
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => copyToClipboard(obj.respostaCopy, itemKey)}
                        className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1.5"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? "Copiado!" : "Copiar Resposta"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 6: PROVAS E ARGUMENTOS */}
          {activeTab === "provas" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {copyData.provasEArgumentos?.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">{item.pilar}</span>
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong className="text-zinc-300 block mb-0.5">Argumento Lógico:</strong>
                      <p className="text-zinc-400 leading-relaxed">{item.argumentoLogico}</p>
                    </div>
                    <div>
                      <strong className="text-amber-300 block mb-0.5">Analogia Visual:</strong>
                      <p className="text-zinc-400 italic leading-relaxed">{item.analogia}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: MICRO-COPIES */}
          {activeTab === "micro" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                <span className="text-[11px] font-mono uppercase text-emerald-400">Badge de Garantia</span>
                <p className="text-xs text-zinc-200 font-semibold">{copyData.microCopies.garantiaBadge}</p>
              </div>
              <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                <span className="text-[11px] font-mono uppercase text-amber-400">Timer de Urgência</span>
                <p className="text-xs text-zinc-200 font-semibold">{copyData.microCopies.urgenciaTimer}</p>
              </div>
              <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                <span className="text-[11px] font-mono uppercase text-cyan-400">Checkout Blindado</span>
                <p className="text-xs text-zinc-200 font-semibold">{copyData.microCopies.checkoutSeguro}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
