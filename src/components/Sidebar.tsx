import React from "react";
import {
  LayoutDashboard,
  Sparkles,
  Lightbulb,
  Cpu,
  Feather,
  FileText,
  Video,
  GitFork,
  Layers,
  Mail,
  BrainCircuit,
  TrendingUp,
  Terminal,
  ShieldCheck,
  X,
} from "lucide-react";
import { MainTab, MasterProject } from "../types";

interface SidebarProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  activeProject: MasterProject;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeProject,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: "Visão Geral" },
    { id: "modelador", label: "1. Modelar Oferta", icon: Sparkles, badge: "URL & Score" },
    { id: "oportunidades", label: "2. Oportunidades", icon: Lightbulb, badge: "5 Ideias" },
    { id: "formato_projeto", label: "3. Projeto-Mestre", icon: Cpu, badge: "Memória SSOT" },
    { id: "copywriting", label: "4. Copywriting", icon: Feather, badge: "Headlines & CTAs" },
    { id: "landing_page", label: "5. Landing Page", icon: FileText, badge: "16 Seções" },
    { id: "criativos", label: "6. Criativos & Ads", icon: Video, badge: "Meta & Reels" },
    { id: "funil", label: "7. Arquiteto de Funil", icon: GitFork, badge: "Bumps & Upsells" },
    { id: "formatos_especificos", label: "8. Formatos Específicos", icon: Layers, badge: "E-book & SaaS PRD" },
    { id: "emails_whatsapp", label: "9. E-mails & WhatsApp", icon: Mail, badge: "Sequências" },
    { id: "inteligencia_memoria", label: "10. Inteligência & Memória", icon: BrainCircuit, badge: "Anti-Alucinação" },
    { id: "expansao", label: "11. Expansão", icon: TrendingUp, badge: "Novas Linhas" },
    { id: "modo_interno", label: "12. Modo Beta / Logs", icon: Terminal, badge: "Telemetria" },
  ];

  const handleItemClick = (tab: MainTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 select-none">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-zinc-950 font-black text-lg sm:text-xl">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-zinc-100 tracking-tight text-sm sm:text-base">Central de Vendas</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  IA
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400">Agência de Modelagem & Vendas</p>
            </div>
          </div>

          {/* Close button on mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Active Project Pill */}
        <div className="mt-3 sm:mt-4 p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Projeto Ativo</p>
            <p className="text-xs font-semibold text-zinc-200 truncate" title={activeProject.nomeProduto}>
              {activeProject.nomeProduto}
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Memória Ativa" />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
        <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
          Workflow Estratégico
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id as MainTab)}
              className={`w-full min-h-[42px] flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group text-left cursor-pointer active:scale-[0.99] ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-300"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 transition-colors ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-zinc-900 text-zinc-400 group-hover:text-zinc-300 border border-zinc-800"
                }`}
              >
                {item.badge}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info & Engine Status */}
      <div className="p-3 sm:p-4 border-t border-zinc-800/80 bg-zinc-950/80">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] truncate">Gemini 3.7 Flash</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">v1.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-72 bg-zinc-950 border-r border-zinc-800/80 flex-col h-screen shrink-0 sticky top-0 z-30 select-none">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay Modal) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Scrim */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs h-full bg-zinc-950 border-r border-zinc-800 z-10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-250">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
