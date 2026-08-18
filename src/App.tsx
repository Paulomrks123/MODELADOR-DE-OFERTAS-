/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { MasterProject, MainTab, OfferAnalysis, Opportunity, ExpansionItem } from "./types";
import { StorageService } from "./lib/storage";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { DashboardView } from "./components/DashboardView";
import { ModeladorView } from "./components/ModeladorView";
import { OportunidadesView } from "./components/OportunidadesView";
import { FormatoEProjetoMestreView } from "./components/FormatoEProjetoMestreView";
import { CopywritingView } from "./components/CopywritingView";
import { LandingPageView } from "./components/LandingPageView";
import { CriativosView } from "./components/CriativosView";
import { FunilView } from "./components/FunilView";
import { FormatosEspecificosView } from "./components/FormatosEspecificosView";
import { EmailsWhatsAppView } from "./components/EmailsWhatsAppView";
import { InteligenciaMemoriaView } from "./components/InteligenciaMemoriaView";
import { ExpansaoView } from "./components/ExpansaoView";
import { ModoInternoView } from "./components/ModoInternoView";
import { LayoutDashboard, Sparkles, Lightbulb, Cpu, Menu } from "lucide-react";

export default function App() {
  const [projects, setProjects] = useState<MasterProject[]>([]);
  const [activeProject, setActiveProject] = useState<MasterProject | null>(null);
  const [currentTab, setCurrentTab] = useState<MainTab>("dashboard");
  const [latestAnalysis, setLatestAnalysis] = useState<OfferAnalysis | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | undefined>(undefined);
  const [modelingInitialUrl, setModelingInitialUrl] = useState<string>("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Initialize from Storage
  useEffect(() => {
    const loadedProjects = StorageService.getProjects();
    const active = StorageService.getActiveProject();
    const analysis = StorageService.getLatestAnalysis();
    const opps = StorageService.getOpportunities();

    setProjects(loadedProjects);
    setActiveProject(active);
    setLatestAnalysis(analysis);
    setOpportunities(opps);
  }, []);

  const handleSelectProject = (id: string) => {
    const proj = StorageService.setActiveProject(id);
    if (proj) {
      setActiveProject(proj);
      setProjects(StorageService.getProjects());
    }
  };

  const handleNewProject = () => {
    const newProj: MasterProject = {
      id: "proj-" + Date.now(),
      slug: "novo-produto",
      nomeProduto: "Novo Produto / Oferta",
      nicho: "Geral",
      subnicho: "Oportunidade",
      bigIdea: "Nova ideia inovadora de alto impacto",
      posicionamento: "Posicionamento premium",
      propostaUnicaValor: "Entrega simplificada e rápida",
      mecanismoUnico: {
        nome: "Protocolo Rápido",
        explicacao: "Método proprietário de aceleração",
      },
      promessaPrincipal: "Transformação garantida em tempo recorde",
      promessasSecundarias: [],
      avatar: {
        nome: "Profissional Dedicado",
        momentoVidaContexto: "Buscando escalar resultados",
        doresProfundas: ["Falta de clareza", "Sobrecarga de tarefas"],
        desejosSecretos: ["Reconhecimento", "Liberdade de tempo"],
        medosInconfessiveis: ["Ficar para trás"],
        objecoesComuns: ["Será que funciona para mim?"],
        inimigoComum: "Complexidade excessiva",
        linguagemTermosChave: ["escala", "lucro", "autonomia"],
      },
      oferta: {
        nomeOferta: "Acesso Completo",
        precoPrincipal: "R$ 97,00",
        ancoragem: "De R$ 497 por apenas",
        garantia: "7 dias de garantia incondicional",
        urgencia: "Vagas limitadas",
        escassez: "Lote promocional",
        ctaPrincipal: "Garantir Acesso Imediato",
        bonusExclusivos: [
          {
            titulo: "Guia Rápido de Implementação",
            descricao: "Checklist passo a passo",
            valorPercebido: "R$ 97",
          },
        ],
      },
      formatosEscolhidos: ["SaaS", "Landing Page", "E-book"],
      regrasMemoria: [
        "Respeitar o tom de voz direto e prático",
        "Manter o mecanismo proprietário",
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveProject(newProj);
    StorageService.setActiveProject(newProj.id);
    setProjects(StorageService.getProjects());
    setActiveProject(newProj);
    setCurrentTab("modelador");
  };

  const handleDeleteProject = (id: string) => {
    StorageService.deleteProject(id);
    const updated = StorageService.getProjects();
    setProjects(updated);
    if (activeProject?.id === id && updated.length > 0) {
      setActiveProject(updated[0]);
      StorageService.setActiveProject(updated[0].id);
    }
  };

  const handleAnalysisComplete = (newAnalysis: OfferAnalysis) => {
    setLatestAnalysis(newAnalysis);
    StorageService.saveLatestAnalysis(newAnalysis);
    if (newAnalysis.oportunidades && newAnalysis.oportunidades.length > 0) {
      setOpportunities(newAnalysis.oportunidades);
      StorageService.saveOpportunities(newAnalysis.oportunidades);
    }
  };

  const handleSelectOpportunity = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    const sourceUrl = latestAnalysis?.sourceUrl || latestAnalysis?.url || modelingInitialUrl || activeProject?.sourceUrl || "";

    if (activeProject) {
      const updated: MasterProject = {
        ...activeProject,
        sourceUrl,
        nomeProduto: opp.nomeProvisorio,
        nicho: opp.nicho,
        subnicho: opp.subnicho || activeProject.subnicho,
        bigIdea: opp.diferencial || activeProject.bigIdea,
        posicionamento: opp.diferencial,
        propostaUnicaValor: opp.solucaoProposta,
        mecanismoUnico: {
          nome: opp.mecanismoUnico || "Protocolo de Aceleração",
          explicacao: opp.solucaoProposta,
        },
        avatar: {
          ...activeProject.avatar,
          nome: opp.publico,
          doresProfundas: [opp.problema, ...(activeProject.avatar?.doresProfundas || [])],
          desejosSecretos: [opp.desejo, ...(activeProject.avatar?.desejosSecretos || [])],
        },
        oferta: {
          ...activeProject.oferta,
          precoPrincipal: opp.faixaPrecoSugerida || activeProject.oferta?.precoPrincipal,
          modeloMonetizacao: opp.modeloMonetizacao,
        },
        updatedAt: new Date().toISOString(),
      };
      StorageService.saveProject(updated);
      setActiveProject(updated);
    }
    setCurrentTab("formato_projeto");
  };

  const handleSaveProject = (updated: MasterProject) => {
    StorageService.saveProject(updated);
    setActiveProject(updated);
    setProjects(StorageService.getProjects());
  };

  const handleExportData = () => {
    const backup = StorageService.exportAllData();
    const blob = new Blob([backup], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `central-vendas-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (StorageService.importAllData(content)) {
            alert("Backup importado com sucesso!");
            setProjects(StorageService.getProjects());
            setActiveProject(StorageService.getActiveProject());
            setLatestAnalysis(StorageService.getLatestAnalysis());
            setOpportunities(StorageService.getOpportunities());
          } else {
            alert("Arquivo inválido.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleStartNewWithExpansion = (exp: ExpansionItem) => {
    handleNewProject();
    setCurrentTab("modelador");
  };

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-2xl animate-pulse">
            ⚡
          </div>
          <p className="text-sm font-semibold">Inicializando Central de Vendas com IA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex antialiased selection:bg-emerald-500 selection:text-zinc-950">
      {/* Sidebar Navigation (Persistent on Desktop, Drawer on Mobile) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeProject={activeProject}
        isOpenMobile={mobileDrawerOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          projects={projects}
          activeProject={activeProject}
          currentTab={currentTab}
          onSelectProject={handleSelectProject}
          onNewProject={handleNewProject}
          onDeleteProject={handleDeleteProject}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onSelectTab={setCurrentTab}
          onOpenMobileMenu={() => setMobileDrawerOpen(true)}
        />

        {/* Dynamic Tab Body with safe mobile bottom padding */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
          {currentTab === "dashboard" && (
            <DashboardView
              activeProject={activeProject}
              latestAnalysis={latestAnalysis || StorageService.getLatestAnalysis()}
              totalProjects={projects.length}
              onNavigateTab={setCurrentTab}
              onModelNewUrl={(url) => {
                setModelingInitialUrl(url || "");
                setCurrentTab("modelador");
              }}
            />
          )}

          {currentTab === "modelador" && (
            <ModeladorView
              analysis={latestAnalysis || StorageService.getLatestAnalysis()}
              initialUrl={modelingInitialUrl}
              onAnalysisComplete={handleAnalysisComplete}
              onProceedToOpportunities={() => setCurrentTab("oportunidades")}
            />
          )}

          {currentTab === "oportunidades" && (
            <OportunidadesView
              opportunities={opportunities.length > 0 ? opportunities : StorageService.getOpportunities()}
              analysis={latestAnalysis || StorageService.getLatestAnalysis()}
              onSelectOpportunity={handleSelectOpportunity}
              onUpdateOpportunities={(newOpps) => {
                setOpportunities(newOpps);
                StorageService.saveOpportunities(newOpps);
              }}
            />
          )}

          {currentTab === "formato_projeto" && (
            <FormatoEProjetoMestreView
              project={activeProject}
              activeOpportunity={selectedOpportunity}
              onSaveProject={handleSaveProject}
              onNavigateToNext={() => setCurrentTab("copywriting")}
            />
          )}

          {currentTab === "copywriting" && <CopywritingView project={activeProject} />}

          {currentTab === "landing_page" && <LandingPageView project={activeProject} />}

          {currentTab === "criativos" && <CriativosView project={activeProject} />}

          {currentTab === "funil" && <FunilView project={activeProject} />}

          {currentTab === "formatos_especificos" && <FormatosEspecificosView project={activeProject} />}

          {currentTab === "emails_whatsapp" && <EmailsWhatsAppView project={activeProject} />}

          {currentTab === "inteligencia_memoria" && (
            <InteligenciaMemoriaView
              project={activeProject}
              onSaveProject={handleSaveProject}
            />
          )}

          {currentTab === "expansao" && (
            <ExpansaoView
              project={activeProject}
              onNavigateTab={setCurrentTab}
              onStartNewWithExpansion={handleStartNewWithExpansion}
            />
          )}

          {currentTab === "modo_interno" && (
            <ModoInternoView
              onDataImported={() => {
                setProjects(StorageService.getProjects());
                setActiveProject(StorageService.getActiveProject());
              }}
            />
          )}
        </main>

        {/* Mobile Quick Bottom Navigation Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/90 px-2 py-1.5 flex items-center justify-around">
          <button
            onClick={() => setCurrentTab("dashboard")}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors cursor-pointer min-w-[54px] ${
              currentTab === "dashboard" ? "text-emerald-400 font-bold" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Início</span>
          </button>

          <button
            onClick={() => setCurrentTab("modelador")}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors cursor-pointer min-w-[54px] ${
              currentTab === "modelador" ? "text-emerald-400 font-bold" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Modelar</span>
          </button>

          <button
            onClick={() => setCurrentTab("oportunidades")}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors cursor-pointer min-w-[54px] ${
              currentTab === "oportunidades" ? "text-emerald-400 font-bold" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Lightbulb className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Ideias</span>
          </button>

          <button
            onClick={() => setCurrentTab("formato_projeto")}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors cursor-pointer min-w-[54px] ${
              currentTab === "formato_projeto" ? "text-emerald-400 font-bold" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Cpu className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Projeto</span>
          </button>

          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer min-w-[54px]"
          >
            <Menu className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Mais</span>
          </button>
        </div>
      </div>
    </div>
  );
}
