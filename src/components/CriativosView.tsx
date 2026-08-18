import React, { useState, useEffect } from "react";
import {
  Video,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Instagram,
  Flame,
  Target,
  ArrowRight,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { MasterProject, CreativeItem } from "../types";
import { ApiService } from "../lib/api";
import { StorageService } from "../lib/storage";

interface CriativosViewProps {
  project: MasterProject;
}

export const CriativosView: React.FC<CriativosViewProps> = ({ project }) => {
  const [loading, setLoading] = useState(false);
  const [creatives, setCreatives] = useState<CreativeItem[]>([]);
  const [dicas, setDicas] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formatFilter, setFormatFilter] = useState<string>("all");

  useEffect(() => {
    const cached = StorageService.getAsset<{ creatives: CreativeItem[]; dicasDeSegmentacao: string[] }>(
      "creatives",
      project.id
    );
    if (cached) {
      setCreatives(cached.creatives || []);
      setDicas(cached.dicasDeSegmentacao || []);
    } else {
      handleGenerate();
    }
  }, [project.id]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await ApiService.generateCreatives({
        masterProject: project,
      });
      if (res && res.creatives) {
        setCreatives(res.creatives);
        setDicas(res.dicasDeSegmentacao || []);
        StorageService.saveAsset("creatives", project.id, {
          creatives: res.creatives,
          dicasDeSegmentacao: res.dicasDeSegmentacao,
        });
      }
    } catch (err: any) {
      console.error(err);
      alert("Erro ao gerar criativos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCreatives = creatives.filter((c) => {
    if (formatFilter === "all") return true;
    return c.formato.toLowerCase().includes(formatFilter.toLowerCase());
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <span>ETAPA 6 — GERADOR DE CRIATIVOS & ADS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Anúncios de Alta Conversão (Meta, Reels & Stories)
            </h1>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Criativos segmentados por ângulos: Dor aguda, Curiosidade irresistível, Quebra de crença e Prova lógica.
              Inclui hooks de 3 segundos, roteiro, sugestão visual e público ideal.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-zinc-950" /> : <Sparkles className="w-4 h-4 text-zinc-950" />}
            <span>{loading ? "Criando Anúncios..." : "Regenerar Criativos"}</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium mr-2">Formato:</span>
          {["all", "feed", "reels", "stories", "carrossel"].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormatFilter(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                formatFilter === fmt
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold"
                  : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {fmt === "all" ? "Todos os Formatos" : fmt}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm font-semibold text-zinc-200">Criando variações de anúncios de alta performance...</p>
        </div>
      )}

      {/* Creatives Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCreatives.map((creative, idx) => {
            const itemKey = `creative-${idx}`;
            const isCopied = copiedId === itemKey;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-4 shadow-lg hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {creative.formato} • {creative.angulo}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">AD #{idx + 1}</span>
                  </div>

                  {/* Hook de 3 segundos */}
                  <div className="p-3 rounded-lg bg-zinc-950 border border-amber-500/30 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Hook dos Primeiros 3 Segundos:</span>
                    </div>
                    <p className="text-xs text-zinc-100 font-semibold italic">"{creative.hook}"</p>
                  </div>

                  {/* Texto Principal / Roteiro */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-400">Texto Principal / Narração:</span>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                      {creative.textoPrincipal}
                    </p>
                  </div>

                  {/* Ideia Visual / Gravação */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-400">Direção Visual / Cena:</span>
                    <p className="text-xs text-zinc-400 italic bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/50">
                      {creative.ideiaVisual}
                    </p>
                  </div>

                  {/* Carrossel Slides if any */}
                  {creative.slides && creative.slides.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-cyan-400">Roteiro dos Slides:</span>
                      <div className="space-y-1">
                        {creative.slides.map((s, sIdx) => (
                          <div key={sIdx} className="text-xs text-zinc-300 flex items-start gap-1.5 bg-zinc-950 p-2 rounded">
                            <span className="text-emerald-400 font-mono font-bold">{sIdx + 1}.</span>
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom CTA & Copy button */}
                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-zinc-500 font-medium">CTA Recomendado:</span>{" "}
                    <strong className="text-emerald-400">{creative.ctaRecomendado}</strong>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        `FORMATO: ${creative.formato}\nHOOK: ${creative.hook}\nTEXTO: ${creative.textoPrincipal}\nVISUAL: ${creative.ideiaVisual}\nCTA: ${creative.ctaRecomendado}`,
                        itemKey
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? "Copiado!" : "Copiar Ad"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dicas de Segmentação */}
      {dicas.length > 0 && (
        <div className="p-6 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Diretrizes de Segmentação de Tráfego Pago
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
            {dicas.map((d, i) => (
              <div key={i} className="flex items-start gap-1.5 p-2 rounded-lg bg-zinc-950 border border-zinc-800/80">
                <span className="text-emerald-400">✓</span>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
