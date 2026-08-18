import React, { useState, useEffect } from "react";
import {
  Mail,
  MessageSquare,
  Sparkles,
  Loader2,
  Copy,
  Check,
  PhoneCall,
  Send,
  Video,
  Flame,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { MasterProject, SequencesAsset } from "../types";
import { ApiService } from "../lib/api";
import { StorageService } from "../lib/storage";

interface EmailsWhatsAppViewProps {
  project: MasterProject;
}

export const EmailsWhatsAppView: React.FC<EmailsWhatsAppViewProps> = ({ project }) => {
  const [loading, setLoading] = useState(false);
  const [seqData, setSeqData] = useState<SequencesAsset | null>(null);
  const [activeTab, setActiveTab] = useState<"emails" | "whatsapp" | "scripts">("emails");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const cached = StorageService.getAsset<SequencesAsset>("sequences", project.id);
    if (cached) {
      setSeqData(cached);
    } else {
      handleGenerate();
    }
  }, [project.id]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await ApiService.generateSequences({
        masterProject: project,
      });
      if (res && res.sequences) {
        setSeqData(res.sequences);
        StorageService.saveAsset("sequences", project.id, res.sequences);
      }
    } catch (err: any) {
      console.error(err);
      alert("Erro ao gerar sequências: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <span>ETAPA 9 — SEQUÊNCIAS DE E-MAIL, WHATSAPP & SCRIPTS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Máquina de Conversão & Automação de Vendas
            </h1>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Sequências completas de e-mails para captura e lançamento, mensagens persuasivas para WhatsApp
              (recuperação de carrinho, follow-up, quebra de objeções) e scripts de atendimento 1-a-1.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-zinc-950" /> : <Sparkles className="w-4 h-4 text-zinc-950" />}
            <span>{loading ? "Gerando Automações..." : "Regenerar Sequências"}</span>
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-wrap gap-2">
          {[
            { id: "emails", label: "Sequências de E-mail (8 E-mails)", icon: Mail },
            { id: "whatsapp", label: "Funil de WhatsApp (6 Mensagens)", icon: MessageSquare },
            { id: "scripts", label: "Scripts de Vendas & VSL", icon: PhoneCall },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm font-semibold text-zinc-200">Redigindo sequências de e-mail e mensagens de WhatsApp...</p>
        </div>
      )}

      {!loading && seqData && (
        <div className="space-y-6">
          {/* TAB 1: EMAILS */}
          {activeTab === "emails" && (
            <div className="space-y-6">
              {/* Lançamento / Vendas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-zinc-200">Sequência de Vendas Diretas & Lançamento (5 Dias)</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {seqData.emailsLancamento?.map((em, idx) => {
                    const itemKey = `email-lanc-${idx}`;
                    const isCopied = copiedKey === itemKey;
                    return (
                      <div key={idx} className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                            E-MAIL {idx + 1} • {em.diaDisparo || `Dia ${idx + 1}`} ({em.objetivo})
                          </span>
                          <button
                            onClick={() => copyText(`ASSUNTO: ${em.assunto}\n\nCORPO:\n${em.corpo}`, itemKey)}
                            className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1.5"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{isCopied ? "Copiado!" : "Copiar E-mail"}</span>
                          </button>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-zinc-400">Assunto do E-mail:</span>
                          <p className="text-xs font-bold text-zinc-100 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                            {em.assunto}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-zinc-400">Corpo da Mensagem:</span>
                          <div className="text-xs text-zinc-300 bg-zinc-950/70 p-4 rounded-lg border border-zinc-800/80 leading-relaxed whitespace-pre-wrap font-sans">
                            {em.corpo}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Captura / Lead Magnet */}
              {seqData.emailsCaptura && seqData.emailsCaptura.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <h3 className="text-sm font-bold text-zinc-200">Sequência de Nutrição / Boas-Vindas Lead Magnet</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {seqData.emailsCaptura.map((em, idx) => {
                      const itemKey = `email-cap-${idx}`;
                      const isCopied = copiedKey === itemKey;
                      return (
                        <div key={idx} className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                              NUTRIR #{idx + 1}: {em.objetivo}
                            </span>
                            <button
                              onClick={() => copyText(`ASSUNTO: ${em.assunto}\n\nCORPO:\n${em.corpo}`, itemKey)}
                              className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1.5"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{isCopied ? "Copiado!" : "Copiar"}</span>
                            </button>
                          </div>
                          <p className="text-xs font-bold text-zinc-100">{em.assunto}</p>
                          <div className="text-xs text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800 whitespace-pre-wrap leading-relaxed">
                            {em.corpo}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WHATSAPP */}
          {activeTab === "whatsapp" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "1. Boas-Vindas Imediata", text: seqData.whatsapp.boasVindas, tag: "Instantâneo" },
                { title: "2. Qualificação & Engajamento", text: seqData.whatsapp.qualificacao, tag: "Diagnóstico" },
                { title: "3. Follow-up de Visualização", text: seqData.whatsapp.followUp, tag: "24h depois" },
                { title: "4. Recuperação de Carrinho", text: seqData.whatsapp.carrinhoAbandonado, tag: "Checkout" },
                { title: "5. Quebra de Objeções", text: seqData.whatsapp.quebraObjecao, tag: "Negociação" },
                { title: "6. Pós-Venda & Onboarding", text: seqData.whatsapp.posVenda, tag: "Retenção" },
              ].map((msg, idx) => {
                const itemKey = `wpp-${idx}`;
                const isCopied = copiedKey === itemKey;
                return (
                  <div
                    key={idx}
                    className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400">{msg.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {msg.tag}
                        </span>
                      </div>

                      {/* WhatsApp Bubble Simulation */}
                      <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
                        {msg.text}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => copyText(msg.text, itemKey)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? "Copiado!" : "Copiar Mensagem"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: SCRIPTS DE VENDAS & VSL */}
          {activeTab === "scripts" && (
            <div className="space-y-6">
              {/* Script WhatsApp 1-a-1 */}
              <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-100">Script de Vendas no WhatsApp 1-a-1</h3>
                  <button
                    onClick={() => copyText(seqData.scriptsVendas.whatsapp1a1, "script-wpp")}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    {copiedKey === "script-wpp" ? "Copiado!" : "Copiar Script"}
                  </button>
                </div>
                <div className="text-xs text-zinc-300 bg-zinc-950 p-4 rounded-xl border border-zinc-800 whitespace-pre-wrap leading-relaxed">
                  {seqData.scriptsVendas.whatsapp1a1}
                </div>
              </div>

              {/* Script Direct Instagram */}
              <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-100">Script de Abordagem / Direct Instagram</h3>
                  <button
                    onClick={() => copyText(seqData.scriptsVendas.directInstagram, "script-ig")}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    {copiedKey === "script-ig" ? "Copiado!" : "Copiar Script"}
                  </button>
                </div>
                <div className="text-xs text-zinc-300 bg-zinc-950 p-4 rounded-xl border border-zinc-800 whitespace-pre-wrap leading-relaxed">
                  {seqData.scriptsVendas.directInstagram}
                </div>
              </div>

              {/* Roteiro VSL */}
              <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-100">Roteiro Completo de VSL (Video Sales Letter)</h3>
                  <button
                    onClick={() => copyText(seqData.scriptsVendas.vslRoteiro, "script-vsl")}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    {copiedKey === "script-vsl" ? "Copiado!" : "Copiar Roteiro VSL"}
                  </button>
                </div>
                <div className="text-xs text-zinc-300 bg-zinc-950 p-4 rounded-xl border border-zinc-800 whitespace-pre-wrap leading-relaxed">
                  {seqData.scriptsVendas.vslRoteiro}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
