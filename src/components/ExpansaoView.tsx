import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Sparkles,
  Loader2,
  ArrowRight,
  Zap,
  DollarSign,
  Plus,
  Layers,
  ChevronRight,
} from "lucide-react";
import { MasterProject, ExpansionItem, MainTab } from "../types";
import { ApiService } from "../lib/api";
import { StorageService } from "../lib/storage";

interface ExpansaoViewProps {
  project: MasterProject;
  onNavigateTab: (tab: MainTab) => void;
  onStartNewWithExpansion: (item: ExpansionItem) => void;
}

export const ExpansaoView: React.FC<ExpansaoViewProps> = ({
  project,
  onNavigateTab,
  onStartNewWithExpansion,
}) => {
  const [loading, setLoading] = useState(false);
  const [expansions, setExpansions] = useState<ExpansionItem[]>([]);

  useEffect(() => {
    const cached = StorageService.getAsset<ExpansionItem[]>("expansions", project.id);
    if (cached) {
      setExpansions(cached);
    } else {
      handleGenerate();
    }
  }, [project.id]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await ApiService.expandProject({
        masterProject: project,
      });
      if (res && res.expansions) {
        setExpansions(res.expansions);
        StorageService.saveAsset("expansions", project.id, res.expansions);
      }
    } catch (err: any) {
      console.error(err);
      alert("Erro ao sugerir expansão: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <span>ETAPA 11 — EXPANSÃO DO NEGÓCIO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              O que você quer criar agora?
            </h1>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Descubra novos produtos complementares, ferramentas SaaS satélites, extensões de esteira e linhas de
              receita recorrente para expandir o ecossistema de <strong className="text-zinc-200">{project.nomeProduto}</strong>.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-zinc-950" /> : <Sparkles className="w-4 h-4 text-zinc-950" />}
            <span>{loading ? "Calculando..." : "Descobrir Novas Linhas"}</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm font-semibold text-zinc-200">Mapeando horizontes de escala e novos produtos...</p>
        </div>
      )}

      {/* Expansions Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expansions.map((exp, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 p-6 space-y-4 transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    {exp.tipo}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{exp.potencialFaturamento}</span>
                </div>

                <h3 className="text-base font-bold text-zinc-100">{exp.nome}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">{exp.descricao}</p>

                <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 space-y-1 text-xs">
                  <span className="text-zinc-500 font-semibold">Sinergia com o Projeto Atual:</span>
                  <p className="text-zinc-400">{exp.sinergiaComProjetoAtual}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs text-zinc-500">Formato: {exp.tipo}</span>
                <button
                  onClick={() => onStartNewWithExpansion(exp)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <span>Modelar este produto</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
