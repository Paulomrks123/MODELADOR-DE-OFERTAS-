import React, { useState, useEffect } from "react";
import {
  Terminal,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  RefreshCw,
  Activity,
  HardDrive,
} from "lucide-react";
import { TelemetryLog } from "../types";
import { StorageService } from "../lib/storage";

interface ModoInternoViewProps {
  onDataImported: () => void;
}

export const ModoInternoView: React.FC<ModoInternoViewProps> = ({ onDataImported }) => {
  const [logs, setLogs] = useState<TelemetryLog[]>([]);

  useEffect(() => {
    setLogs(StorageService.getTelemetry());
  }, []);

  const totalCalls = logs.length;
  const successCalls = logs.filter((l) => l.status === "sucesso").length;
  const successRate = totalCalls > 0 ? Math.round((successCalls / totalCalls) * 100) : 100;
  const avgLatency =
    totalCalls > 0
      ? Math.round(logs.reduce((acc, curr) => acc + (curr.duracaoMs || 0), 0) / totalCalls)
      : 0;

  const handleExportBackup = () => {
    const backupJson = StorageService.exportAllData();
    const blob = new Blob([backupJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `central-vendas-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const success = StorageService.importAllData(text);
        if (success) {
          alert("Backup restaurado com sucesso!");
          onDataImported();
          setLogs(StorageService.getTelemetry());
        } else {
          alert("Arquivo de backup inválido.");
        }
      } catch (err: any) {
        alert("Erro ao importar: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleClearTelemetry = () => {
    if (confirm("Deseja limpar todos os logs de telemetria?")) {
      StorageService.clearTelemetry();
      setLogs([]);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <span>ETAPA 12 — PAINEL BETA & TELEMETRIA INTERNA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Monitoramento do Motor de IA & Backups
            </h1>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Acompanhe a latência das chamadas ao Gemini 3.7 Flash, status de execuções dos agentes, taxas de sucesso
              e realize backups ponta a ponta dos projetos salvos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportBackup}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Backup (JSON)</span>
            </button>
            <label className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Importar Backup</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Requisições IA</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-zinc-100">{totalCalls}</p>
          <p className="text-[11px] text-emerald-400">Motor Gemini Ativo</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Taxa de Sucesso</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-zinc-100">{successRate}%</p>
          <p className="text-[11px] text-zinc-400">Zero alucinações críticas</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Latência Média</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-zinc-100">{avgLatency} ms</p>
          <p className="text-[11px] text-zinc-400">Streaming rápido com Gemini Flash</p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-zinc-200">Histórico de Chamadas da IA (Telemetry)</h3>
          </div>
          {logs.length > 0 && (
            <button
              onClick={handleClearTelemetry}
              className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Logs</span>
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-8">Nenhuma chamada registrada na sessão atual.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase">
                  <th className="pb-3">Data/Hora</th>
                  <th className="pb-3">Endpoint</th>
                  <th className="pb-3">Duração</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Feedback</th>
                  <th className="pb-3">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                {logs.slice(0, 20).map((log, idx) => (
                  <tr key={idx} className="hover:bg-zinc-950/50 transition-colors">
                    <td className="py-2.5 text-zinc-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="py-2.5 text-zinc-200 font-semibold">{log.endpoint}</td>
                    <td className="py-2.5 text-zinc-400">{log.duracaoMs} ms</td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          log.status === "sucesso"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-zinc-300">{log.feedback || "—"}</td>
                    <td className="py-2.5 text-zinc-400 max-w-xs truncate">{log.notas || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
