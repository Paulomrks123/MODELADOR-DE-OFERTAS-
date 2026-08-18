import React, { useState, useEffect } from "react";
import {
  FileText,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Eye,
  Code,
  Download,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  Zap,
  ArrowRight,
  Gift,
  Flame,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MasterProject, LandingPageAsset } from "../types";
import { ApiService } from "../lib/api";
import { StorageService } from "../lib/storage";

interface LandingPageViewProps {
  project: MasterProject;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ project }) => {
  const [loading, setLoading] = useState(false);
  const [lpData, setLpData] = useState<LandingPageAsset | null>(null);
  const [viewMode, setViewMode] = useState<"sections" | "preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(1);

  useEffect(() => {
    const cached = StorageService.getAsset<LandingPageAsset>("landing_page", project.id);
    if (cached) {
      setLpData(cached);
    } else {
      handleGenerate();
    }
  }, [project.id]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await ApiService.generateLandingPage({
        masterProject: project,
        stylePreference: "Dark Luxury & High-Conversion",
      });
      if (res && res.landingPage) {
        setLpData(res.landingPage);
        StorageService.saveAsset("landing_page", project.id, res.landingPage);
      }
    } catch (err: any) {
      console.error(err);
      alert("Erro ao gerar landing page: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    if (!lpData) return;
    const text = lpData.sections
      .map((s) => `### ${s.title}\n${JSON.stringify(s, null, 2)}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportHTML = () => {
    if (!lpData) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.nomeProduto} — Página Oficial</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #09090b; color: #f4f4f5; font-family: system-ui, sans-serif; }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-100 antialiased selection:bg-emerald-500 selection:text-zinc-950">
  <!-- HERO SECTION -->
  <header class="py-20 px-6 max-w-5xl mx-auto text-center">
    <span class="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono mb-6">
      ${project.nicho} • ${project.subnicho}
    </span>
    <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
      ${project.promessaPrincipal}
    </h1>
    <p class="text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-8">
      ${project.bigIdea}
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="#checkout" class="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-base shadow-xl shadow-emerald-500/20 transition-all">
        ${project.oferta?.ctaPrincipal || "Quero Garantir Minha Vaga"}
      </a>
    </div>
  </header>

  <!-- OFERTA & BENEFÍCIOS -->
  <main class="max-w-4xl mx-auto px-6 py-12 space-y-16">
    <section class="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
      <h2 class="text-2xl font-bold mb-4">O Que É o ${project.mecanismoUnico?.nome}?</h2>
      <p class="text-zinc-300 leading-relaxed">${project.mecanismoUnico?.explicacao}</p>
    </section>

    <!-- BÔNUS -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-center">Bônus Exclusivos Inclusos</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${project.oferta?.bonusExclusivos?.map((b) => `
          <div class="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <h3 class="font-bold text-emerald-400 text-base">${b.titulo} (${b.valorPercebido})</h3>
            <p class="text-zinc-400 text-sm mt-2">${b.descricao}</p>
          </div>
        `).join("") || ""}
      </div>
    </section>

    <!-- PREÇO -->
    <section id="checkout" class="p-8 rounded-2xl bg-zinc-900 border-2 border-emerald-500/40 text-center space-y-6">
      <span class="text-xs font-mono uppercase text-emerald-400">Oferta Especial de Acesso</span>
      <h2 class="text-3xl font-black">${project.nomeProduto}</h2>
      <div class="text-4xl font-extrabold text-emerald-400">${project.oferta?.precoPrincipal}</div>
      <p class="text-zinc-400 text-sm">${project.oferta?.garantia}</p>
      <button class="w-full max-w-md mx-auto py-4 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-base hover:bg-emerald-400 transition-all">
        ${project.oferta?.ctaPrincipal}
      </button>
    </section>
  </main>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `landing-page-${project.slug || "produto"}.html`;
    a.click();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <span>ETAPA 5 — LANDING PAGE STUDIO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Landing Page Completa (16 Seções Estruturadas)
            </h1>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Estrutura de conversão testada: Hero, Problema, Agitação, Mecanismo Único, Benefícios, Como Funciona,
              Entregáveis, Bônus, Prova, Garantia, FAQ e CTA Final.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportHTML}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Exportar HTML</span>
            </button>
            <button
              onClick={handleCopyText}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              <span>{copied ? "Copiado!" : "Copiar Texto"}</span>
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-zinc-950" /> : <Sparkles className="w-4 h-4 text-zinc-950" />}
              <span>{loading ? "Gerando..." : "Regenerar Página"}</span>
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium mr-2">Modo de Visualização:</span>
          <button
            onClick={() => setViewMode("preview")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === "preview"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visualizador / Live Preview</span>
          </button>
          <button
            onClick={() => setViewMode("sections")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === "sections"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>16 Seções Estruturadas</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm font-semibold text-zinc-200">Redigindo as 16 seções de alta conversão...</p>
        </div>
      )}

      {/* RENDER VIEW: LIVE PREVIEW */}
      {!loading && lpData && viewMode === "preview" && (
        <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
          {/* Mock Browser Topbar */}
          <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="text-xs font-mono text-zinc-500 ml-2">https://{project.slug || "produto"}.com.br</span>
            </div>
            <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              High-Converting Live Canvas
            </span>
          </div>

          {/* Landing Page Content Container */}
          <div className="p-6 sm:p-12 space-y-16 max-w-4xl mx-auto">
            {/* HERO */}
            <div className="text-center space-y-6 pt-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <Zap className="w-3.5 h-3.5" />
                <span>{project.nicho} • {project.subnicho}</span>
              </span>

              <h1 className="text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight leading-tight">
                {project.promessaPrincipal}
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                {project.bigIdea}
              </p>

              <div className="pt-2">
                <button className="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all">
                  {project.oferta?.ctaPrincipal}
                </button>
                <p className="text-[11px] text-zinc-500 mt-2">{project.oferta?.garantia}</p>
              </div>
            </div>

            {/* PROBLEMA & MECANISMO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-400">O Grande Problema</h3>
                <p className="text-sm font-semibold text-zinc-200">
                  {project.avatar?.doresProfundas?.[0] || "Sobrecarga operacional e tarefas manuais"}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  A maioria dos profissionais tenta resolver isso com ferramentas complexas que exigem dezenas de horas de
                  tutoriais e mais atrapalham do que trazem clientes.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">A Solução & Mecanismo Único</h3>
                <p className="text-sm font-bold text-emerald-300">{project.mecanismoUnico?.nome}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{project.mecanismoUnico?.explicacao}</p>
              </div>
            </div>

            {/* BÔNUS EXCLUSIVOS */}
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-xs font-mono uppercase text-amber-400">Presentes Especiais</span>
                <h2 className="text-2xl font-bold text-zinc-100 mt-1">Bônus Exclusivos de Ação Rápida</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.oferta?.bonusExclusivos?.map((b, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <Gift className="w-4 h-4 text-amber-400" />
                      <span className="text-[10px] font-mono text-emerald-400">{b.valorPercebido}</span>
                    </div>
                    <h4 className="text-xs font-bold text-zinc-200">{b.titulo}</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{b.descricao}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PREÇO & OFERTA BLINDADA */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-emerald-500/40 text-center space-y-6 shadow-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                CONDIÇÃO ESPECIAL DE LANÇAMENTO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-100">{project.nomeProduto}</h2>
              <div className="text-4xl sm:text-5xl font-black text-emerald-400">{project.oferta?.precoPrincipal}</div>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">{project.oferta?.ancoragem}</p>
              <div>
                <button className="w-full max-w-md mx-auto py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all">
                  {project.oferta?.ctaPrincipal}
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>{project.oferta?.garantia}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER VIEW: SECTIONS ACCORDION */}
      {!loading && lpData && viewMode === "sections" && (
        <div className="space-y-4">
          {lpData.sections?.map((sec, idx) => {
            const isExpanded = expandedSection === sec.id;
            return (
              <div key={sec.id || idx} className="rounded-xl bg-zinc-900/70 border border-zinc-800 overflow-hidden">
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : sec.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-850 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                      {sec.id < 10 ? `0${sec.id}` : sec.id}
                    </span>
                    <span className="text-xs font-bold text-zinc-200">{sec.title}</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                </button>

                {isExpanded && (
                  <div className="p-4 bg-zinc-950/80 border-t border-zinc-800/80 text-xs space-y-3">
                    <pre className="p-3 rounded-lg bg-zinc-900 text-zinc-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(sec, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
