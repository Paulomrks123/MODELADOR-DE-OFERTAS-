import React, { useState, useEffect } from "react";
import {
  Layers,
  Sparkles,
  Loader2,
  BookOpen,
  Cpu,
  GraduationCap,
  Globe,
  Copy,
  Check,
  Download,
  Terminal,
  Code,
  CheckCircle2,
  FileCode,
} from "lucide-react";
import { MasterProject } from "../types";
import { ApiService } from "../lib/api";
import { StorageService } from "../lib/storage";

interface FormatosEspecificosViewProps {
  project: MasterProject;
}

export const FormatosEspecificosView: React.FC<FormatosEspecificosViewProps> = ({ project }) => {
  const [activeFormat, setActiveFormat] = useState<"ebook" | "saas" | "curso" | "microsite">("saas");
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<Record<string, any>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const cached = StorageService.getAsset<any>(`format_${activeFormat}`, project.id);
    if (cached) {
      setAssets((prev) => ({ ...prev, [activeFormat]: cached }));
    } else {
      handleGenerateFormat(activeFormat);
    }
  }, [activeFormat, project.id]);

  const handleGenerateFormat = async (format: "ebook" | "saas" | "curso" | "microsite") => {
    setLoading(true);
    try {
      const res = await ApiService.generateFormatAsset({
        masterProject: project,
        formatType: format,
      });
      if (res && res.asset) {
        setAssets((prev) => ({ ...prev, [format]: res.asset }));
        StorageService.saveAsset(`format_${format}`, project.id, res.asset);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Erro ao gerar asset do formato ${format}: ` + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportMarkdown = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.md`;
    a.click();
  };

  const currentAsset = assets[activeFormat];
  const lovablePrompt = currentAsset?.promptLovable || currentAsset?.promptTecnicoParaLovable;
  const saasFeatures = currentAsset?.featuresCore || currentAsset?.funcionalidadesMVP || [];
  const saasSchema =
    typeof currentAsset?.schemaBanco === "string"
      ? currentAsset.schemaBanco
      : currentAsset?.arquiteturaBancoDados
      ? JSON.stringify(currentAsset.arquiteturaBancoDados, null, 2)
      : "";
  const saasVisao = currentAsset?.visaoGeral || currentAsset?.objetivoPrincipal || currentAsset?.propostaValor;
  const saasProblema = currentAsset?.problema || currentAsset?.publicoAlvo;
  const saasStack = currentAsset?.stackRecomendada || "React 19 + Tailwind + Vite + Supabase + Gemini API";
  const saasMonetizacao =
    currentAsset?.monetizacao ||
    (Array.isArray(currentAsset?.modeloMonetizacaoETiers)
      ? currentAsset.modeloMonetizacaoETiers.map((t: any) => `${t.plano}: ${t.preco}`).join(" • ")
      : "R$ 47 a R$ 147 / mês");

  const ebookTitulo = currentAsset?.titulo || currentAsset?.nomeEbook || project.nomeProduto;
  const ebookSubtitulo = currentAsset?.subtitulo || currentAsset?.promessa;
  const ebookIntro = currentAsset?.introducao || currentAsset?.introducaoCompleta;
  const ebookCapitulos = currentAsset?.capitulos || currentAsset?.sumario || [];

  const cursoModulos = currentAsset?.modulos || [];
  const micrositePaginas = currentAsset?.paginas || currentAsset?.estruturaPaginas || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <span>ETAPA 8 — FORMATOS ESPECÍFICOS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Geradores Especializados por Formato de Produto
            </h1>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Produza a estrutura técnica e o conteúdo profundo para o formato escolhido: E-book com sumário e
              capítulos, App/SaaS PRD com Prompt Especial para o Lovable, Grade Curricular de Curso ou Microsite.
            </p>
          </div>

          <button
            onClick={() => handleGenerateFormat(activeFormat)}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-zinc-950" /> : <Sparkles className="w-4 h-4 text-zinc-950" />}
            <span>{loading ? "Gerando..." : "Regenerar Formato"}</span>
          </button>
        </div>

        {/* Format Sub-Navigation */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-wrap gap-2">
          {[
            { id: "saas", label: "App & SaaS PRD + Prompt Lovable", icon: Cpu },
            { id: "ebook", label: "E-book & Capítulos Completos", icon: BookOpen },
            { id: "curso", label: "Curso & Área de Membros", icon: GraduationCap },
            { id: "microsite", label: "Microsite Enxuto", icon: Globe },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeFormat === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveFormat(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm font-semibold text-zinc-200">Gerando conteúdo estrutural profundo para o formato {activeFormat}...</p>
        </div>
      )}

      {/* RENDER: SAAS / APP PRD */}
      {!loading && activeFormat === "saas" && currentAsset && (
        <div className="space-y-6">
          {/* LOVABLE PROMPT SPECIAL CALLOUT */}
          {lovablePrompt && (
            <div className="rounded-2xl bg-gradient-to-r from-purple-950/80 via-zinc-900 to-zinc-900 border-2 border-purple-500/40 p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-lg">
                    ✨
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-purple-400 tracking-wider">
                      Integração Pronta para No-Code / AI Coder
                    </span>
                    <h3 className="text-base font-bold text-zinc-100">Prompt Especializado para o Lovable</h3>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(lovablePrompt, "lovable")}
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  {copiedKey === "lovable" ? <Check className="w-4 h-4 text-zinc-950" /> : <Copy className="w-4 h-4 text-zinc-950" />}
                  <span>{copiedKey === "lovable" ? "Copiado com Sucesso!" : "Copiar Prompt do Lovable"}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {lovablePrompt}
              </div>
            </div>
          )}

          {/* PRD OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Visão Geral & Problema</h4>
              <p className="text-sm font-bold text-zinc-100">{currentAsset.nomeApp || project.nomeProduto}</p>
              <p className="text-xs text-zinc-300 leading-relaxed">{saasVisao}</p>
              {saasProblema && (
                <div className="pt-2 text-xs">
                  <strong className="text-zinc-400">Problema / Foco:</strong>
                  <p className="text-zinc-300 mt-0.5">{saasProblema}</p>
                </div>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Stack & Monetização</h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-zinc-500 font-semibold">Tecnologia Recomendada:</span>
                  <p className="text-zinc-200">{saasStack}</p>
                </div>
                <div>
                  <span className="text-zinc-500 font-semibold">Modelo de Assinatura:</span>
                  <p className="text-emerald-400 font-bold">{saasMonetizacao}</p>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURES CORE & SCREENS */}
          {saasFeatures.length > 0 && (
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                Funcionalidades Core (MVP Scope)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {saasFeatures.map((f: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <span className="text-xs font-bold text-emerald-300">{f.nome || f.modulo || f}</span>
                    {(f.descricao || f.prioridade) && (
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {f.prioridade ? `[${f.prioridade}] ` : ""}{f.descricao}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DATABASE SCHEMA */}
          {saasSchema && (
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Schema de Banco de Dados Sugerido</h4>
                <button
                  onClick={() => copyToClipboard(saasSchema, "schema")}
                  className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                >
                  {copiedKey === "schema" ? "Copiado!" : "Copiar SQL/Schema"}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-300 font-mono text-[11px] overflow-x-auto">
                {saasSchema}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* RENDER: EBOOK */}
      {!loading && activeFormat === "ebook" && currentAsset && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800">
            <div>
              <span className="text-xs font-mono uppercase text-emerald-400">Estrutura Editorial</span>
              <h3 className="text-base font-bold text-zinc-100 mt-1">{ebookTitulo}</h3>
              <p className="text-xs text-zinc-400">{ebookSubtitulo}</p>
            </div>

            <button
              onClick={() =>
                handleExportMarkdown(
                  `ebook-${project.slug || "livro"}`,
                  `# ${ebookTitulo}\n## ${ebookSubtitulo || ""}\n\n${ebookIntro || ""}\n\n` +
                    ebookCapitulos
                      .map((c: any) => `### ${c.numero || ""}. ${c.titulo || ""}\n${c.resumo || ""}\n\n${c.conteudoCompleto || (c.topicos ? c.topicos.join("\n- ") : "")}`)
                      .join("\n\n")
                )
              }
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Exportar E-book (.MD)</span>
            </button>
          </div>

          {/* INTRODUÇÃO */}
          {ebookIntro && (
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Introdução Magnética</h4>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 whitespace-pre-wrap">
                {ebookIntro}
              </p>
            </div>
          )}

          {/* CAPÍTULOS */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Grade de Capítulos ({ebookCapitulos.length})
            </h4>
            {ebookCapitulos.map((c: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                      CAPÍTULO {c.numero || idx + 1}
                    </span>
                    <h5 className="text-sm font-bold text-zinc-100">{c.titulo}</h5>
                  </div>
                </div>
                {c.resumo && <p className="text-xs text-zinc-400 leading-relaxed">{c.resumo}</p>}
                {c.topicos && Array.isArray(c.topicos) && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-semibold text-zinc-500">Tópicos abordados:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {c.topicos.map((t: string, tIdx: number) => (
                        <div key={tIdx} className="text-xs text-zinc-300 flex items-center gap-1.5">
                          <span className="text-emerald-400">•</span>
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {c.conteudoCompleto && (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {c.conteudoCompleto}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RENDER: CURSO / MEMBROS */}
      {!loading && activeFormat === "curso" && currentAsset && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-zinc-100">
              {currentAsset.nomeCurso || "Grade Curricular do Curso / Mentoria"}
            </h3>
            {currentAsset.promessaEducacional && (
              <p className="text-xs text-zinc-400 leading-relaxed">{currentAsset.promessaEducacional}</p>
            )}
            <div className="space-y-4">
              {cursoModulos.map((mod: any, mIdx: number) => (
                <div key={mIdx} className="p-5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">MÓDULO {mod.moduloNumero || mIdx + 1}:</span>
                    <h4 className="text-xs font-bold text-zinc-100">{mod.nome || mod.titulo}</h4>
                  </div>
                  {mod.objetivo && <p className="text-xs text-zinc-400">{mod.objetivo}</p>}

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-semibold text-zinc-500">Aulas do Módulo:</span>
                    {mod.aulas?.map((aula: any, aIdx: number) => (
                      <div key={aIdx} className="text-xs text-zinc-300 flex items-start gap-2 bg-zinc-900/70 p-2.5 rounded-lg">
                        <span className="text-emerald-400 font-mono">{aIdx + 1}.</span>
                        <div className="flex-1">
                          <strong className="text-zinc-200">{aula.titulo || aula}</strong>
                          {aula.duracaoEstimada && (
                            <span className="text-[10px] text-zinc-500 font-mono ml-2">({aula.duracaoEstimada})</span>
                          )}
                          {aula.descricao && <p className="text-[11px] text-zinc-400 mt-0.5">{aula.descricao}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RENDER: MICROSITE */}
      {!loading && activeFormat === "microsite" && currentAsset && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-zinc-100">
              {currentAsset.nomeSite || "Arquitetura de Microsite Enxuto"}
            </h3>
            {currentAsset.proposito && (
              <p className="text-xs text-zinc-400 leading-relaxed">{currentAsset.proposito}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {micrositePaginas.map((p: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                  <span className="text-xs font-bold text-emerald-300">{p.pagina || p.nome}</span>
                  {p.slug && <span className="text-[10px] text-zinc-500 font-mono block">/{p.slug}</span>}
                  <p className="text-[11px] text-zinc-400 mt-1">{p.objetivo || p.conteudo}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
