import React, { useState } from "react";
import {
  FolderKanban,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Layers,
  ChevronDown,
  Trash2,
  Sparkles,
  Menu,
} from "lucide-react";
import { MasterProject, MainTab } from "../types";

interface NavbarProps {
  projects: MasterProject[];
  activeProject: MasterProject;
  currentTab: MainTab;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDeleteProject: (id: string) => void;
  onExportData: () => void;
  onImportData: () => void;
  onSelectTab: (tab: MainTab) => void;
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projects,
  activeProject,
  currentTab,
  onSelectProject,
  onNewProject,
  onDeleteProject,
  onExportData,
  onImportData,
  onSelectTab,
  onOpenMobileMenu,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const tabLabels: Record<MainTab, string> = {
    dashboard: "Dashboard",
    modelador: "1. Modelar Oferta & Score",
    oportunidades: "2. 5 Oportunidades",
    formato_projeto: "3. Projeto-Mestre",
    copywriting: "4. Copywriting",
    landing_page: "5. Landing Page Studio",
    criativos: "6. Criativos & Ads",
    funil: "7. Arquiteto de Funis",
    formatos_especificos: "8. Formatos Específicos",
    emails_whatsapp: "9. E-mails & WhatsApp",
    inteligencia_memoria: "10. Memória Viva",
    expansao: "11. Expansão",
    modo_interno: "12. Modo Beta / Logs",
  };

  return (
    <header className="h-14 sm:h-16 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left side: Hamburger menu for mobile & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors shrink-0"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-zinc-400 min-w-0">
          <span className="font-mono text-emerald-400 hidden xs:inline font-bold">CENTRAL</span>
          <span className="hidden xs:inline text-zinc-600">/</span>
          <span className="font-semibold text-zinc-200 truncate">{tabLabels[currentTab]}</span>
        </div>
      </div>

      {/* Right side: Action Center & Project Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Model New Button Shortcut */}
        <button
          onClick={() => onSelectTab("modelador")}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
          title="Modelar Nova Oferta"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="hidden sm:inline">Modelar Oferta</span>
        </button>

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 text-xs font-medium transition-colors cursor-pointer"
          >
            <FolderKanban className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="max-w-[90px] sm:max-w-[140px] truncate">{activeProject.nomeProduto}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop for closing dropdown on mobile/desktop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
                aria-hidden="true"
              />

              <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2 py-1.5 text-[10px] uppercase font-mono tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>Projetos ({projects.length})</span>
                  <button
                    onClick={() => {
                      onNewProject();
                      setDropdownOpen(false);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Novo
                  </button>
                </div>

                <div className="mt-1 space-y-1 max-h-56 overflow-y-auto">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                        proj.id === activeProject.id
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 font-medium"
                          : "hover:bg-zinc-800/70 text-zinc-300"
                      }`}
                    >
                      <button
                        onClick={() => {
                          onSelectProject(proj.id);
                          setDropdownOpen(false);
                        }}
                        className="flex-1 text-left truncate mr-2 cursor-pointer"
                      >
                        {proj.nomeProduto}
                      </button>
                      {projects.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Excluir o projeto "${proj.nomeProduto}"?`)) {
                              onDeleteProject(proj.id);
                            }
                          }}
                          className="text-zinc-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                          title="Excluir Projeto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Export / Backup options */}
        <div className="flex items-center gap-0.5 sm:gap-1 border-l border-zinc-800 pl-1.5 sm:pl-3">
          <button
            onClick={onExportData}
            title="Exportar Backup (JSON)"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onImportData}
            title="Restaurar Backup (JSON)"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
