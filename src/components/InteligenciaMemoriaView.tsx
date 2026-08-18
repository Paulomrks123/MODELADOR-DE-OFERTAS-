import React, { useState } from "react";
import {
  BrainCircuit,
  ShieldCheck,
  Search,
  Plus,
  Trash2,
  Lock,
  Save,
  CheckCircle2,
  Database,
  FileCode,
  Sparkles,
} from "lucide-react";
import { MasterProject } from "../types";
import { StorageService } from "../lib/storage";

interface InteligenciaMemoriaViewProps {
  project: MasterProject;
  onSaveProject: (p: MasterProject) => void;
}

export const InteligenciaMemoriaView: React.FC<InteligenciaMemoriaViewProps> = ({
  project,
  onSaveProject,
}) => {
  const [rules, setRules] = useState<string[]>(
    project.regrasMemoria || [
      "Nunca prometer resultados mágicos ou sem esforço do cliente.",
      "Manter o mecanismo 'Protocolo de Aceleração Rápida' em todas as copies.",
      "O tom de voz deve ser direto, prático e focado em autonomia.",
    ]
  );
  const [newRuleInput, setNewRuleInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddRule = () => {
    if (!newRuleInput.trim()) return;
    const updated = [...rules, newRuleInput.trim()];
    setRules(updated);
    setNewRuleInput("");
  };

  const handleRemoveRule = (index: number) => {
    const updated = rules.filter((_, i) => i !== index);
    setRules(updated);
  };

  const handleSaveMemory = () => {
    const updatedProject: MasterProject = {
      ...project,
      regrasMemoria: rules,
      updatedAt: new Date().toISOString(),
    };
    onSaveProject(updatedProject);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Global Project Search
  const allProjectText = JSON.stringify(project).toLowerCase();
  const searchMatchCount = searchQuery
    ? (allProjectText.match(new RegExp(searchQuery.toLowerCase(), "g")) || []).length
    : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <span>ETAPA 10 — CENTRO DE INTELIGÊNCIA & MEMÓRIA VIVA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Single Source of Truth & Sistema Anti-Alucinação
            </h1>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Esta memória garante que nenhum gerador crie promessas contraditórias, altere os preços definidos ou
              mude o tom de voz do avatar. Cada chamada à IA é condicionada pelas regras invioláveis abaixo.
            </p>
          </div>

          <button
            onClick={handleSaveMemory}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? "Memória Sincronizada!" : "Salvar Regras da Memória"}</span>
          </button>
        </div>
      </div>

      {/* Global Search across Project Assets */}
      <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-zinc-200">Busca Global na Memória do Projeto</h3>
          </div>
          {searchQuery && (
            <span className="text-xs font-mono text-emerald-400">
              {searchMatchCount} ocorrência(s) encontrada(s)
            </span>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por qualquer termo, dor, promessa, bônus ou preço no projeto..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-xs text-zinc-200 placeholder-zinc-500 outline-none"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Inviolable Rules Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-zinc-200">Regras Invioláveis de Geração</h3>
            </div>
            <span className="text-xs text-zinc-400 font-mono">{rules.length} regras ativas</span>
          </div>

          {/* Add New Rule */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newRuleInput}
              onChange={(e) => setNewRuleInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddRule()}
              placeholder="Adicionar nova diretriz ou limite ético para a IA respeitar..."
              className="flex-1 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-zinc-700 text-xs text-zinc-200 placeholder-zinc-500 outline-none"
            />
            <button
              onClick={handleAddRule}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Adicionar</span>
            </button>
          </div>

          {/* Rules List */}
          <div className="space-y-2">
            {rules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-mono text-xs font-bold shrink-0">{idx + 1}.</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{rule}</p>
                </div>
                <button
                  onClick={() => handleRemoveRule(idx)}
                  className="text-zinc-500 hover:text-red-400 p-1 transition-colors shrink-0"
                  title="Remover Regra"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Snapshot Summary */}
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Snapshot da Memória Central
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
              <span className="text-zinc-500 font-semibold block">Produto:</span>
              <p className="text-zinc-200 font-bold mt-0.5">{project.nomeProduto}</p>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
              <span className="text-zinc-500 font-semibold block">Avatar:</span>
              <p className="text-zinc-200 mt-0.5">{project.avatar?.nome}</p>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
              <span className="text-zinc-500 font-semibold block">Mecanismo Único:</span>
              <p className="text-amber-300 font-medium mt-0.5">{project.mecanismoUnico?.nome}</p>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
              <span className="text-zinc-500 font-semibold block">Preço Principal:</span>
              <p className="text-emerald-400 font-bold mt-0.5">{project.oferta?.precoPrincipal}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
