import React, { useState } from "react";
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  Loader2,
  DollarSign,
  Layers,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  Globe,
  Link2,
} from "lucide-react";
import { Opportunity, OfferAnalysis } from "../types";
import { ApiService } from "../lib/api";

interface OportunidadesViewProps {
  opportunities: Opportunity[];
  analysis: OfferAnalysis;
  sourceUrl?: string;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onUpdateOpportunities: (newOpps: Opportunity[]) => void;
}

export const OportunidadesView: React.FC<OportunidadesViewProps> = ({
  opportunities,
  analysis,
  sourceUrl,
  onSelectOpportunity,
  onUpdateOpportunities,
}) => {
  const [loading, setLoading] = useState(false);
  const [customDirections, setCustomDirections] = useState("");
  const [filterComplexity, setFilterComplexity] = useState<string>("all");

  const effectiveUrl = sourceUrl || (analysis as any)?.sourceUrl || (analysis as any)?.url || "";

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const res = await ApiService.generateOpportunities({
        analysis,
        customDirections: customDirections.trim(),
        url: effectiveUrl,
      });
      if (res.opportunities && res.opportunities.length > 0) {
        onUpdateOpportunities(res.opportunities);
      }
    } catch (err: any) {
      alert("Erro ao regenerar oportunidades: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter((op) => {
    if (filterComplexity === "all") return true;
    return op.complexidade?.toLowerCase() === filterComplexity.toLowerCase();
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <span>ETAPA 2 — GERADOR DE OPORTUNIDADES ORIGINAIS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
              5 Oportunidades de Negócios & Produtos Inovadores
            </h1>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              As 5 oportunidades abaixo foram estruturadas a partir da engenharia reversa da URL analisada,
              explorando novos públicos, mecanismos proprietários, formatos inovadores (SaaS, micro-app, e-book, curso, comunidade) e modelos lucrativos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 hover:scale-105"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-zinc-950" /> : <Sparkles className="w-4 h-4 text-zinc-950" />}
              <span>{loading ? "Regenerando Ideias..." : "Regenerar 5 Ideias da URL"}</span>
            </button>
          </div>
        </div>

        {/* Reference URL context highlight box */}
        {effectiveUrl && (
          <div className="mt-5 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">URL de Origem & Modelagem</span>
                <span className="font-mono text-emerald-300 font-medium truncate block max-w-lg" title={effectiveUrl}>
                  {effectiveUrl}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-[11px] text-zinc-400">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                Nicho: <strong className="text-zinc-100">{analysis?.nicho || "Geral"}</strong>
              </span>
              {analysis?.subnicho && (
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  Subnicho: <strong className="text-zinc-100">{analysis.subnicho}</strong>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Refinement input & filters */}
        <div className="mt-6 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full flex items-center gap-2">
            <input
              type="text"
              value={customDirections}
              onChange={(e) => setCustomDirections(e.target.value)}
              placeholder="Direcionamento opcional (ex: 'Focar em SaaS com IA', 'Priorizar produto Low-Ticket abaixo de R$ 97')..."
              className="w-full px-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-xs text-zinc-200 placeholder-zinc-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-zinc-400 flex items-center gap-1 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filtrar:
            </span>
            {["all", "baixa", "média", "alta"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterComplexity(lvl)}
                className={`px-2.5 py-1 rounded-md text-xs capitalize transition-colors ${
                  filterComplexity === lvl
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium"
                    : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                {lvl === "all" ? "Todas" : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5 Opportunity Cards Grid */}
      <div className="space-y-6">
        {filteredOpportunities.map((opp, idx) => (
          <div
            key={opp.id || idx}
            className="group rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 p-6 transition-all duration-200 space-y-5 shadow-lg relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    OPORTUNIDADE #{idx + 1}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {opp.nicho}
                  </span>
                  {opp.subnicho && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {opp.subnicho}
                    </span>
                  )}
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                      opp.complexidade === "Baixa"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : opp.complexidade === "Média"
                        ? "bg-amber-500/10 text-amber-300"
                        : "bg-purple-500/10 text-purple-300"
                    }`}
                  >
                    Complexidade: {opp.complexidade}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                  {opp.nomeProvisorio}
                </h3>
                {opp.tagline && <p className="text-xs text-zinc-400 italic">{opp.tagline}</p>}
              </div>

              {/* Price & Choose Opportunity Button */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-zinc-400">Preço Sugerido</span>
                  <p className="text-sm font-bold text-emerald-400">{opp.faixaPrecoSugerida}</p>
                </div>
                <button
                  onClick={() => onSelectOpportunity(opp)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer"
                >
                  <span>Escolher esta oportunidade</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Strategic Attributes Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-zinc-400">Público & Dor Raiz</span>
                <p className="text-zinc-200 font-semibold">{opp.publico}</p>
                <p className="text-zinc-400 mt-1">
                  <strong className="text-red-400">Problema:</strong> {opp.problema}
                </p>
                <p className="text-zinc-400">
                  <strong className="text-emerald-400">Desejo:</strong> {opp.desejo}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-zinc-400">Solução & Diferencial vs URL</span>
                <p className="text-zinc-200 font-semibold">{opp.solucaoProposta}</p>
                <p className="text-amber-300 mt-1">
                  <strong>Mecanismo Único:</strong> {opp.mecanismoUnico || "Protocolo de Aceleração Rápida"}
                </p>
                <p className="text-zinc-400">
                  <strong>Diferencial:</strong> {opp.diferencial}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-zinc-400">Formato & Monetização</span>
                <p className="text-zinc-200 font-semibold">{opp.formatoRecomendado}</p>
                <p className="text-zinc-400 mt-1">
                  <strong>Monetização:</strong> {opp.modeloMonetizacao}
                </p>
                <p className="text-zinc-400">
                  <strong>Expansão:</strong> {opp.potencialExpansao}
                </p>
              </div>
            </div>

            {/* Strategic Rationale */}
            <div className="p-3 rounded-lg bg-zinc-950/40 border border-zinc-800/50 text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-300">Justificativa Estratégica (vs URL):</strong> {opp.justificativaEstrategica}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
