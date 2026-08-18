import React, { useState, useEffect } from "react";
import {
  GitFork,
  Sparkles,
  Loader2,
  Copy,
  Check,
  ArrowRight,
  ArrowDown,
  DollarSign,
  ShieldCheck,
  ShoppingBag,
  Zap,
  Tag,
  Gift,
} from "lucide-react";
import { MasterProject, FunnelAsset } from "../types";
import { ApiService } from "../lib/api";
import { StorageService } from "../lib/storage";

interface FunilViewProps {
  project: MasterProject;
}

export const FunilView: React.FC<FunilViewProps> = ({ project }) => {
  const [loading, setLoading] = useState(false);
  const [funnelData, setFunnelData] = useState<FunnelAsset | null>(null);
  const [activeTab, setActiveTab] = useState<"visual" | "bump" | "upsell" | "downsell">("visual");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const cached = StorageService.getAsset<FunnelAsset>("funnel", project.id);
    if (cached) {
      setFunnelData(cached);
    } else {
      handleGenerate();
    }
  }, [project.id]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await ApiService.generateFunnel({
        masterProject: project,
        funnelType: "High-ROI Order Bump + 1-Click Upsell",
      });
      if (res && res.funnel) {
        setFunnelData(res.funnel);
        StorageService.saveAsset("funnel", project.id, res.funnel);
      }
    } catch (err: any) {
      console.error(err);
      alert("Erro ao gerar funil: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const bumpTitle = funnelData?.orderBump?.titulo || funnelData?.orderBump?.nome || "Order Bump Especial";
  const bumpPrice = funnelData?.orderBump?.precoSugerido || funnelData?.orderBump?.preco || "R$ 37,00";
  const bumpCopy = funnelData?.orderBump?.copyCheckbox || "Marque a caixa para adicionar esta oferta ao seu pedido.";
  const bumpPromessa = funnelData?.orderBump?.promessa || funnelData?.orderBump?.beneficioChave || "Complemento acelerador de resultados.";
  const bumpEntregavel = funnelData?.orderBump?.entregavel || funnelData?.orderBump?.relacaoProdutoPrincipal || "Entrega imediata junto com o produto principal.";

  const upsellTitle = funnelData?.upsell1?.titulo || funnelData?.upsell?.nome || "Upgrade VIP / 1-Click Upsell";
  const upsellPrice = funnelData?.upsell1?.precoSugerido || funnelData?.upsell?.preco || "R$ 197,00";
  const upsellHeadline = funnelData?.upsell1?.headlinePagina || funnelData?.upsell?.headline || "Espere! Esta oportunidade exclusiva não será mostrada novamente.";
  const upsellVideo = funnelData?.upsell1?.roteiroVideo || funnelData?.upsell?.argumentacaoCopy || "Apresentação da solução avançada e aceleradora.";
  const upsellJustificativa = funnelData?.upsell1?.justificativa || (funnelData?.upsell?.beneficios ? funnelData.upsell.beneficios.join(" • ") : "Perfeito para quem deseja acelerar em 3x os resultados.");

  const downsellTitle = funnelData?.downsell1?.titulo || funnelData?.downsell?.nome || "Oferta Especial Reduzida (Downsell)";
  const downsellPrice = funnelData?.downsell1?.precoSugerido || funnelData?.downsell?.preco || "R$ 97,00";
  const downsellProposta = funnelData?.downsell1?.proposta || funnelData?.downsell?.ofertaReduzida || funnelData?.downsell?.copy || "Versão compacta e acessível da solução completa.";
  const downsellDiferenca = funnelData?.downsell1?.diferenca || funnelData?.downsell?.justificativa || "Mesma essência em condições especiais de pagamento.";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <span>ETAPA 7 — ARQUITETO DE FUNIS & MONETIZAÇÃO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Esteira de Ofertas: Order Bump, Upsell & Downsell
            </h1>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Multiplique o LTV e o ticket médio de cada cliente com uma arquitetura de funil de alta conversão
              desenhada especificamente para o <strong className="text-zinc-200">{project.nomeProduto}</strong>.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-zinc-950" /> : <Sparkles className="w-4 h-4 text-zinc-950" />}
            <span>{loading ? "Calculando Funil..." : "Regenerar Funil"}</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-wrap gap-2">
          {[
            { id: "visual", label: "Mapa Visual do Funil" },
            { id: "bump", label: "Order Bump de Checkout" },
            { id: "upsell", label: "Upsell 1-Click" },
            { id: "downsell", label: "Downsell Estratégico" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm font-semibold text-zinc-200">Arquitetando esteira de monetização irresistível...</p>
        </div>
      )}

      {!loading && funnelData && (
        <div className="space-y-6">
          {/* TAB 1: MAPA VISUAL DO FUNIL */}
          {activeTab === "visual" && (
            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-8 space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <span className="text-xs font-mono uppercase text-emerald-400">Fluxo Completo de Vendas</span>
                <h3 className="text-lg font-bold text-zinc-100">{funnelData.tipoFunil}</h3>
                <p className="text-xs text-zinc-400">
                  Estimativa de conversão de bump: <strong className="text-emerald-400">38%</strong> • Estimativa de upsell:{" "}
                  <strong className="text-emerald-400">18%</strong>
                </p>
              </div>

              {/* Node Sequence Visualizer */}
              <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
                {/* Step 1: Front-end */}
                <div className="w-full p-5 rounded-xl bg-zinc-900 border border-zinc-800 text-center relative group hover:border-emerald-500/40 transition-all">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    Etapa 1 • Front-End
                  </span>
                  <h4 className="text-sm font-bold text-zinc-100 mt-2">{project.nomeProduto}</h4>
                  <p className="text-xs text-emerald-400 font-bold mt-1">{project.oferta?.precoPrincipal}</p>
                </div>

                <ArrowDown className="w-5 h-5 text-emerald-400" />

                {/* Step 2: Checkout + Order Bump */}
                <div className="w-full p-5 rounded-xl bg-zinc-900 border-2 border-dashed border-emerald-500/40 text-center relative">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                    Etapa 2 • Checkout + Order Bump
                  </span>
                  <h4 className="text-sm font-bold text-emerald-300 mt-2">{bumpTitle}</h4>
                  <p className="text-xs text-zinc-300 mt-1 font-semibold">{bumpPrice}</p>
                  <p className="text-xs text-zinc-400 mt-1 italic">"{bumpCopy}"</p>
                </div>

                <ArrowDown className="w-5 h-5 text-emerald-400" />

                {/* Step 3: Upsell & Downsell Split */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Upsell */}
                  <div className="p-5 rounded-xl bg-zinc-900 border border-emerald-500/30 text-center space-y-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      Etapa 3A • Upsell 1-Click
                    </span>
                    <h4 className="text-xs font-bold text-zinc-100">{upsellTitle}</h4>
                    <p className="text-xs font-bold text-emerald-400">{upsellPrice}</p>
                  </div>

                  {/* Downsell */}
                  <div className="p-5 rounded-xl bg-zinc-900 border border-amber-500/30 text-center space-y-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      Etapa 3B • Downsell (Se Recusar)
                    </span>
                    <h4 className="text-xs font-bold text-zinc-100">{downsellTitle}</h4>
                    <p className="text-xs font-bold text-amber-400">{downsellPrice}</p>
                  </div>
                </div>

                <ArrowDown className="w-5 h-5 text-emerald-400" />

                {/* Step 4: Final Fulfillment */}
                <div className="w-full p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                  <span className="text-[10px] font-mono uppercase text-zinc-400">Etapa 4 • Entrega & Onboarding</span>
                  <p className="text-xs font-semibold text-zinc-300 mt-1">
                    Acesso imediato à Área de Membros + Sequência de Boas-Vindas no WhatsApp
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER BUMP */}
          {activeTab === "bump" && (
            <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase text-emerald-400">Conversão de Checkout</span>
                  <h3 className="text-base font-bold text-zinc-100 mt-1">{bumpTitle}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-zinc-500">Preço</span>
                  <p className="text-lg font-bold text-emerald-400">{bumpPrice}</p>
                </div>
              </div>

              {/* Checkout Box Simulation */}
              <div className="p-5 rounded-xl bg-zinc-950 border-2 border-dashed border-emerald-500/40 space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-zinc-100">
                      SIM! Quero adicionar "{bumpTitle}" por apenas {bumpPrice}
                    </span>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed italic">
                      "{bumpCopy}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                  <strong className="text-zinc-300">Promessa Rápida:</strong>
                  <p className="text-zinc-400">{bumpPromessa}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                  <strong className="text-zinc-300">O que é entregue:</strong>
                  <p className="text-zinc-400">{bumpEntregavel}</p>
                </div>
              </div>

              <button
                onClick={() =>
                  copyText(
                    `ORDER BUMP: ${bumpTitle}\nPREÇO: ${bumpPrice}\nCOPY: ${bumpCopy}`,
                    "bump"
                  )
                }
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                {copiedKey === "bump" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === "bump" ? "Copiado!" : "Copiar Order Bump"}</span>
              </button>
            </div>
          )}

          {/* TAB 3: UPSELL 1-CLICK */}
          {activeTab === "upsell" && (
            <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase text-emerald-400">Oferta 1-Click Pós-Compra</span>
                  <h3 className="text-base font-bold text-zinc-100 mt-1">{upsellTitle}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-zinc-500">Preço</span>
                  <p className="text-lg font-bold text-emerald-400">{upsellPrice}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[11px] font-semibold text-amber-400">Headline da Página de Upsell:</span>
                  <p className="text-sm font-bold text-zinc-100">"{upsellHeadline}"</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-400">Roteiro da VSL de Upsell (2 Minutos):</span>
                  <p className="text-zinc-300 leading-relaxed italic">{upsellVideo}</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400">Justificativa Irresistível:</span>
                  <p className="text-zinc-400">{upsellJustificativa}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOWNSELL */}
          {activeTab === "downsell" && (
            <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase text-amber-400">Recuperação de Venda de Upsell</span>
                  <h3 className="text-base font-bold text-zinc-100 mt-1">{downsellTitle}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-zinc-500">Preço</span>
                  <p className="text-lg font-bold text-amber-400">{downsellPrice}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[11px] font-semibold text-amber-400">Proposta do Downsell:</span>
                  <p className="text-zinc-300 leading-relaxed">{downsellProposta}</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400">Diferença em Relação ao Upsell:</span>
                  <p className="text-zinc-400">{downsellDiferenca}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
