import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  FileText,
  Video,
  GitFork,
  BrainCircuit,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  Globe,
  Loader2,
  Flame,
  Clock,
  Compass,
  Clipboard,
  Trash2,
} from "lucide-react";
import { MasterProject, MainTab, OfferAnalysis } from "../types";

interface DashboardViewProps {
  activeProject: MasterProject;
  latestAnalysis: OfferAnalysis;
  totalProjects: number;
  onNavigateTab: (tab: MainTab) => void;
  onModelNewUrl: (initialUrl?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activeProject,
  latestAnalysis,
  totalProjects,
  onNavigateTab,
  onModelNewUrl,
}) => {
  const [quickUrl, setQuickUrl] = useState("");

  const handleStartModeling = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onModelNewUrl(quickUrl.trim());
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setQuickUrl(text.trim());
      }
    } catch {
      // ignore
    }
  };

  const steps = [
    { num: 1, title: "Analisar", desc: "Modelagem & Score", tab: "modelador" as MainTab },
    { num: 2, title: "Descobrir", desc: "5 Oportunidades", tab: "oportunidades" as MainTab },
    { num: 3, title: "Escolher", desc: "Formato & Projeto", tab: "formato_projeto" as MainTab },
    { num: 4, title: "Estruturar", desc: "Copywriting & Oferta", tab: "copywriting" as MainTab },
    { num: 5, title: "Criar", desc: "Landing Page & Assets", tab: "landing_page" as MainTab },
    { num: 6, title: "Vender", desc: "Funil, Ads & E-mails", tab: "funil" as MainTab },
    { num: 7, title: "Expandir", desc: "Novas Linhas & SaaS", tab: "expansao" as MainTab },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Primary Hero Section with Central Highlighted URL Input & 'Modelar Oferta' Action Button */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/95 to-zinc-950 border border-zinc-800/90 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wide">
            <Zap className="w-3.5 h-3.5" />
            <span>CENTRAL DE VENDAS COM IA • MODELAGEM DE OFERTAS</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Insira a URL de uma oferta e transforme em um novo negócio digital.
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            A IA analisa a estratégia, mapeia o avatar, disseca os mecanismos de conversão e constrói um novo
            ecossistema original: produto, copywriting, landing page e funil de vendas.
          </p>

          {/* Central Highlighted URL Input & 'Modelar Oferta' Button */}
          <form onSubmit={handleStartModeling} className="pt-3 max-w-2xl mx-auto text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2 rounded-2xl bg-zinc-950/90 border border-zinc-800 focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 shadow-2xl transition-all">
              <div className="relative flex-1 w-full flex items-center">
                <Globe className="w-5 h-5 text-emerald-400 absolute left-4 pointer-events-none shrink-0" />
                <input
                  type="url"
                  id="dashboard-url-input"
                  value={quickUrl}
                  onChange={(e) => setQuickUrl(e.target.value)}
                  placeholder="Cole aqui a URL da oferta (ex: https://site.com/oferta)"
                  className="w-full pl-12 pr-20 py-3.5 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none font-medium"
                />
                
                <div className="absolute right-3 flex items-center gap-1.5">
                  {quickUrl ? (
                    <button
                      type="button"
                      onClick={() => setQuickUrl("")}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                      title="Limpar URL"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePasteClipboard}
                      className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      title="Colar da Área de Transferência"
                    >
                      <Clipboard className="w-3 h-3 text-emerald-400" />
                      <span>Colar</span>
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                id="btn-modelar-oferta"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4 text-zinc-950" />
                <span>Modelar Oferta</span>
              </button>
            </div>

            {/* Quick Presets / Examples */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-zinc-500">
              <span className="font-semibold text-zinc-400">Exemplos rápidos:</span>
              <button
                type="button"
                onClick={() => {
                  const url = "https://exemplo.com.br/mentoria-alta-renda-vendas";
                  setQuickUrl(url);
                  onModelNewUrl(url);
                }}
                className="text-zinc-400 hover:text-emerald-400 underline decoration-zinc-700 hover:decoration-emerald-400 cursor-pointer transition-colors"
              >
                Mentoria High-Ticket
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  const url = "https://exemplo.com.br/saas-automacao-whatsapp";
                  setQuickUrl(url);
                  onModelNewUrl(url);
                }}
                className="text-zinc-400 hover:text-emerald-400 underline decoration-zinc-700 hover:decoration-emerald-400 cursor-pointer transition-colors"
              >
                SaaS de Vendas
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  const url = "https://exemplo.com.br/desafio-14-dias-foco-total";
                  setQuickUrl(url);
                  onModelNewUrl(url);
                }}
                className="text-zinc-400 hover:text-emerald-400 underline decoration-zinc-700 hover:decoration-emerald-400 cursor-pointer transition-colors"
              >
                E-book / Desafio Low-Ticket
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Principle Workflow Banner (Sequential Engine) */}
      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
              Fluxo Sequencial Inteligente
            </span>
            <h3 className="text-sm font-semibold text-zinc-200">
              ANALISAR → DESCOBRIR → ESCOLHER → ESTRUTURAR → CRIAR → VENDER → EXPANDIR
            </h3>
          </div>
          <span className="text-xs text-zinc-400 hidden sm:inline">Clique na etapa para navegar</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => onNavigateTab(s.tab)}
              className="group text-left p-3 rounded-lg bg-zinc-950/70 border border-zinc-800 hover:border-emerald-500/40 hover:bg-zinc-900/80 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400 group-hover:text-emerald-400 font-bold">
                  0{s.num}
                </span>
                <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-3">
                <p className="text-xs font-bold text-zinc-200 group-hover:text-emerald-300 truncate">{s.title}</p>
                <p className="text-[10px] text-zinc-400 truncate">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Projetos Ativos</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-100 mt-2">{totalProjects}</p>
          <p className="text-[11px] text-zinc-400 mt-1">Armazenados no Banco Seguro</p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Score da Oferta</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-100 mt-2">{latestAnalysis.score?.geral || 88}/100</p>
          <p className="text-[11px] text-emerald-400 mt-1">Alto Potencial de Mercado</p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Formatos Integrados</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <GitFork className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-100 mt-2">{activeProject.formatosEscolhidos?.length || 4}</p>
          <p className="text-[11px] text-zinc-400 mt-1">E-book, SaaS, LP & Membros</p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Memória Anti-Alucinação</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-100 mt-2">100% Sincronizada</p>
          <p className="text-[11px] text-zinc-400 mt-1">Single Source of Truth Ativo</p>
        </div>
      </div>

      {/* Active Master Project Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-zinc-900/80 border border-zinc-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ★
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-100">{activeProject.nomeProduto}</h3>
                <p className="text-xs text-zinc-400">
                  {activeProject.nicho} • {activeProject.subnicho}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab("formato_projeto")}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              Editar Projeto <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 mb-1">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Big Idea & Posicionamento</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{activeProject.bigIdea}</p>
            </div>

            <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Mecanismo Único</span>
              </div>
              <p className="text-xs font-bold text-zinc-200">{activeProject.mecanismoUnico?.nome}</p>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{activeProject.mecanismoUnico?.explicacao}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-300">Avatar Central</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                {activeProject.avatar?.nome}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400">
              <div>
                <span className="text-zinc-500 font-semibold">Dor Central:</span>{" "}
                {activeProject.avatar?.doresProfundas?.[0] || "Sobrecarga operacional e falta de tempo"}
              </div>
              <div>
                <span className="text-zinc-500 font-semibold">Oferta:</span> {activeProject.oferta?.precoPrincipal}
              </div>
            </div>
          </div>

          {/* Formats Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-zinc-400">Formatos Ativos:</span>
            {activeProject.formatosEscolhidos?.map((fmt) => (
              <span
                key={fmt}
                className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Launchpad to Generators */}
        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-200">Geradores Disponíveis</h3>
          <p className="text-xs text-zinc-400">Todos os módulos utilizam a inteligência do Projeto-Mestre ativo.</p>

          <div className="space-y-2">
            {[
              { label: "Central de Copywriting", desc: "Headlines, CTAs & Bullets", icon: FileText, tab: "copywriting" as MainTab },
              { label: "Landing Page Studio", desc: "16 seções completas + Export HTML", icon: Layers, tab: "landing_page" as MainTab },
              { label: "Gerador de Criativos", desc: "Anúncios Meta, Reels & Hooks", icon: Video, tab: "criativos" as MainTab },
              { label: "Arquiteto de Funis", desc: "Order Bumps & Upsells 1-Click", icon: GitFork, tab: "funil" as MainTab },
              { label: "E-book & SaaS PRD", desc: "Estruturas, capítulos e prompt Lovable", icon: Compass, tab: "formatos_especificos" as MainTab },
              { label: "E-mails & WhatsApp", desc: "Sequências de conversão e scripts", icon: BrainCircuit, tab: "emails_whatsapp" as MainTab },
            ].map((gen) => {
              const Icon = gen.icon;
              return (
                <button
                  key={gen.tab}
                  onClick={() => onNavigateTab(gen.tab)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-zinc-900 text-zinc-400 group-hover:text-emerald-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-200 group-hover:text-emerald-300">{gen.label}</p>
                      <p className="text-[11px] text-zinc-400">{gen.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
