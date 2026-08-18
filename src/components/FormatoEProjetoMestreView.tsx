import React, { useState } from "react";
import {
  Cpu,
  Layers,
  Sparkles,
  Loader2,
  CheckCircle2,
  Save,
  Download,
  Copy,
  Check,
  Target,
  Zap,
  ShieldCheck,
  DollarSign,
  Gift,
  Lock,
  ArrowRight,
  Flame,
  Globe,
} from "lucide-react";
import { MasterProject, ProductFormat, Opportunity } from "../types";
import { ApiService } from "../lib/api";

interface FormatoEProjetoMestreViewProps {
  project: MasterProject;
  activeOpportunity?: Opportunity;
  onSaveProject: (updatedProject: MasterProject) => void;
  onNavigateToNext: () => void;
}

export const FormatoEProjetoMestreView: React.FC<FormatoEProjetoMestreViewProps> = ({
  project,
  activeOpportunity,
  onSaveProject,
  onNavigateToNext,
}) => {
  const allFormats: { format: ProductFormat; label: string; desc: string }[] = [
    { format: "E-book", label: "1. E-book", desc: "Guia prático, checklists e capítulos" },
    { format: "Microsite", label: "2. Microsite", desc: "Site enxuto com captura e propostas" },
    { format: "Landing Page", label: "3. Landing Page", desc: "Página de vendas de alta conversão" },
    { format: "Curso", label: "4. Curso", desc: "Grade de aulas, módulos e exercícios" },
    { format: "Área de membros", label: "5. Área de membros", desc: "Plataforma com retenção e gamificação" },
    { format: "Aplicativo", label: "6. Aplicativo", desc: "App mobile/desktop com PRD e telas" },
    { format: "SaaS", label: "7. SaaS", desc: "Software como serviço recorrente" },
    { format: "Comunidade", label: "8. Comunidade", desc: "Networking, sprints e encontros" },
    { format: "Serviço", label: "9. Serviço", desc: "Consultoria, assessoria ou Done-For-You" },
    { format: "Produto híbrido", label: "10. Produto Híbrido", desc: "Combinação (ex: App + Curso + E-book)" },
  ];

  const [selectedFormats, setSelectedFormats] = useState<ProductFormat[]>(
    project.formatosEscolhidos || ["SaaS", "Landing Page", "Área de membros", "E-book"]
  );

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable fields state
  const [nomeProduto, setNomeProduto] = useState(project.nomeProduto);
  const [bigIdea, setBigIdea] = useState(project.bigIdea);
  const [posicionamento, setPosicionamento] = useState(project.posicionamento);
  const [propostaUnicaValor, setPropostaUnicaValor] = useState(project.propostaUnicaValor);
  const [mecanismoNome, setMecanismoNome] = useState(project.mecanismoUnico?.nome || "");
  const [mecanismoExp, setMecanismoExp] = useState(project.mecanismoUnico?.explicacao || "");
  const [promessaPrincipal, setPromessaPrincipal] = useState(project.promessaPrincipal);
  const [avatarNome, setAvatarNome] = useState(project.avatar?.nome || "");
  const [avatarContexto, setAvatarContexto] = useState(project.avatar?.momentoVidaContexto || "");
  const [ofertaPreco, setOfertaPreco] = useState(project.oferta?.precoPrincipal || "");
  const [ofertaGarantia, setOfertaGarantia] = useState(project.oferta?.garantia || "");
  const [ofertaCTA, setOfertaCTA] = useState(project.oferta?.ctaPrincipal || "");

  const toggleFormat = (fmt: ProductFormat) => {
    if (selectedFormats.includes(fmt)) {
      if (selectedFormats.length > 1) {
        setSelectedFormats(selectedFormats.filter((f) => f !== fmt));
      }
    } else {
      setSelectedFormats([...selectedFormats, fmt]);
    }
  };

  const handleGenerateMasterProject = async () => {
    if (!activeOpportunity && !project) return;
    setLoading(true);

    try {
      const oppToUse: Opportunity = activeOpportunity || {
        id: "current-opp",
        nomeProvisorio: nomeProduto,
        nicho: project.nicho,
        subnicho: project.subnicho,
        publico: project.avatar?.nome || "Público Geral",
        problema: project.avatar?.doresProfundas?.[0] || "Problema",
        desejo: project.avatar?.desejosSecretos?.[0] || "Desejo",
        solucaoProposta: propostaUnicaValor,
        mecanismoUnico: mecanismoNome,
        diferencial: project.posicionamento,
        formatoRecomendado: selectedFormats.join(" + "),
        modeloMonetizacao: project.oferta?.modeloMonetizacao || "Pagamento Único",
        faixaPrecoSugerida: ofertaPreco,
        complexidade: "Média",
        potencialExpansao: "Alta",
        justificativaEstrategica: "Alinhado à estratégia de mercado",
      };

      const res = await ApiService.createMasterProject({
        opportunity: oppToUse,
        selectedFormats,
        sourceUrl: project.sourceUrl || (activeOpportunity as any)?.sourceUrl,
      });

      if (res && res.masterProject) {
        const mp = { ...res.masterProject, id: project.id, sourceUrl: project.sourceUrl || res.metadata?.sourceUrl };
        onSaveProject(mp);
        setNomeProduto(mp.nomeProduto);
        setBigIdea(mp.bigIdea);
        setPosicionamento(mp.posicionamento);
        setPropostaUnicaValor(mp.propostaUnicaValor);
        setMecanismoNome(mp.mecanismoUnico.nome);
        setMecanismoExp(mp.mecanismoUnico.explicacao);
        setPromessaPrincipal(mp.promessaPrincipal);
        setAvatarNome(mp.avatar.nome || "");
        setAvatarContexto(mp.avatar.momentoVidaContexto || "");
        setOfertaPreco(mp.oferta.precoPrincipal);
        setOfertaGarantia(mp.oferta.garantia);
        setOfertaCTA(mp.oferta.ctaPrincipal);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err: any) {
      alert("Erro ao criar Projeto-Mestre: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSave = () => {
    const updated: MasterProject = {
      ...project,
      nomeProduto,
      bigIdea,
      posicionamento,
      propostaUnicaValor,
      mecanismoUnico: {
        nome: mecanismoNome,
        explicacao: mecanismoExp,
      },
      promessaPrincipal,
      avatar: {
        ...project.avatar,
        nome: avatarNome,
        momentoVidaContexto: avatarContexto,
      },
      oferta: {
        ...project.oferta,
        precoPrincipal: ofertaPreco,
        garantia: ofertaGarantia,
        ctaPrincipal: ofertaCTA,
      },
      formatosEscolhidos: selectedFormats,
      updatedAt: new Date().toISOString(),
    };

    onSaveProject(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportMarkdown = () => {
    const md = `# PROJETO-MESTRE: ${nomeProduto}
**Nicho:** ${project.nicho} | **Subnicho:** ${project.subnicho}
**Formatos Escolhidos:** ${selectedFormats.join(", ")}

---

## 1. POSICIONAMENTO & BIG IDEA
- **Big Idea:** ${bigIdea}
- **Posicionamento:** ${posicionamento}
- **Proposta Única de Valor (UVP):** ${propostaUnicaValor}
- **Mecanismo Único:** ${mecanismoNome} (${mecanismoExp})
- **Promessa Principal:** ${promessaPrincipal}

---

## 2. AVATAR CENTRAL
- **Avatar:** ${avatarNome}
- **Contexto:** ${avatarContexto}
- **Dores Profundas:**\n${project.avatar?.doresProfundas?.map((d) => `  - ${d}`).join("\n") || "  - Sobrecarga e falta de tempo"}
- **Inimigo Comum:** ${project.avatar?.inimigoComum || "Complexidade excessiva"}

---

## 3. OFERTA IRRESISTÍVEL
- **Preço Principal:** ${ofertaPreco}
- **Garantia:** ${ofertaGarantia}
- **CTA:** ${ofertaCTA}
- **Bônus:**\n${project.oferta?.bonusExclusivos?.map((b) => `  - **${b.titulo}** (${b.valorPercebido}): ${b.descricao}`).join("\n") || ""}

---

## 4. REGRAS INVIOLÁVEIS DA MEMÓRIA
${project.regrasMemoria?.map((r) => `- ${r}`).join("\n") || "- Respeitar a simplicidade"}
`;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `projeto-mestre-${project.slug || "produto"}.md`;
    a.click();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <span>ETAPA 3 — ESCOLHA DE FORMATO & PROJETO-MESTRE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              A Memória Central & Single Source of Truth
            </h1>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              O Projeto-Mestre armazena o posicionamento, avatar, mecanismo e oferta. Todos os geradores posteriores
              (Copy, Landing Page, Criativos, Funil, E-book, SaaS, E-mails) consultarão esta memória para garantir 100% de
              consistência.
            </p>
            {project?.sourceUrl && (
              <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400">
                <Globe className="w-3.5 h-3.5" />
                <span>Baseado na modelagem da URL:</span>
                <span className="text-zinc-200 underline truncate max-w-xs sm:max-w-md" title={project.sourceUrl}>
                  {project.sourceUrl}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportMarkdown}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-zinc-400" />
              <span>Exportar .MD</span>
            </button>
            <button
              onClick={handleManualSave}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? "Salvo com Sucesso!" : "Salvar Memória"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Format Selection Matrix */}
      <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-200">Como você quer transformar essa oportunidade?</h3>
            <p className="text-xs text-zinc-400">Você pode selecionar múltiplos formatos para criar um ecossistema integrado.</p>
          </div>
          <button
            onClick={handleGenerateMasterProject}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
            <span>Regenerar Estratégia Completa com IA</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {allFormats.map((item) => {
            const isSelected = selectedFormats.includes(item.format);
            return (
              <button
                key={item.format}
                onClick={() => toggleFormat(item.format)}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? "bg-emerald-500/15 border-emerald-500/40 text-zinc-100 shadow-sm"
                    : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? "text-emerald-300" : "text-zinc-200"}`}>
                    {item.label}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 leading-snug">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Single Source of Truth / Project Master Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Posicionamento, Big Idea & Mecanismo */}
        <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Zap className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Posicionamento & Mecanismo Único
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Nome Oficial do Produto:</label>
              <input
                type="text"
                value={nomeProduto}
                onChange={(e) => setNomeProduto(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 font-semibold focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Big Idea do Negócio:</label>
              <textarea
                value={bigIdea}
                onChange={(e) => setBigIdea(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 leading-relaxed focus:border-emerald-500 outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Posicionamento de Mercado:</label>
              <textarea
                value={posicionamento}
                onChange={(e) => setPosicionamento(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 leading-relaxed focus:border-emerald-500 outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Proposta Única de Valor (UVP):</label>
              <textarea
                value={propostaUnicaValor}
                onChange={(e) => setPropostaUnicaValor(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 leading-relaxed focus:border-emerald-500 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Nome do Mecanismo Único:</label>
                <input
                  type="text"
                  value={mecanismoNome}
                  onChange={(e) => setMecanismoNome(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-amber-300 font-semibold focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Promessa Principal:</label>
                <input
                  type="text"
                  value={promessaPrincipal}
                  onChange={(e) => setPromessaPrincipal(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-300 font-medium focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Explicação do Mecanismo:</label>
              <textarea
                value={mecanismoExp}
                onChange={(e) => setMecanismoExp(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 leading-relaxed focus:border-zinc-700 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Avatar Profundo & Oferta */}
        <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Target className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Avatar & Oferta Irresistível</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Nome e Perfil do Avatar:</label>
              <input
                type="text"
                value={avatarNome}
                onChange={(e) => setAvatarNome(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 font-semibold focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Contexto & Momento de Vida:</label>
              <textarea
                value={avatarContexto}
                onChange={(e) => setAvatarContexto(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 leading-relaxed focus:border-cyan-500 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Preço Principal & Ancoragem:</label>
                <input
                  type="text"
                  value={ofertaPreco}
                  onChange={(e) => setOfertaPreco(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400 font-bold focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Chamada para Ação (CTA):</label>
                <input
                  type="text"
                  value={ofertaCTA}
                  onChange={(e) => setOfertaCTA(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 font-medium focus:border-zinc-700 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Garantia Blindada:</label>
              <input
                type="text"
                value={ofertaGarantia}
                onChange={(e) => setOfertaGarantia(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-zinc-700 outline-none"
              />
            </div>

            {/* Inviolable Memory Rules List */}
            <div className="pt-2">
              <label className="text-zinc-400 font-semibold block mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Regras Invioláveis da Memória da IA:</span>
              </label>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-1">
                {project.regrasMemoria?.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-zinc-300">
                    <span className="text-emerald-400">✓</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-zinc-900/90 border border-zinc-800">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Projeto-Mestre Sincronizado</h4>
          <p className="text-xs text-zinc-400">Todos os geradores estão prontos para produzir ativos conectados a esta memória.</p>
        </div>
        <button
          onClick={onNavigateToNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer"
        >
          <span>Ir para Central de Copywriting</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
