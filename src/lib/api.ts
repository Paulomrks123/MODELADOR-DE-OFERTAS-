import {
  OfferAnalysis,
  Opportunity,
  MasterProject,
  ProductFormat,
  CopywritingHub,
  LandingPageAsset,
  CreativesAsset,
  FunnelAsset,
  SequencesAsset,
  ExpansionItem,
} from "../types";
import { StorageService } from "./storage";

async function postJSON<T>(endpoint: string, payload: any, maxRetries = 2): Promise<T> {
  let attempt = 0;

  while (attempt <= maxRetries) {
    const startTime = Date.now();
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const durationMs = Date.now() - startTime;

      if (!res.ok) {
        const isServerDemandError =
          res.status === 503 ||
          res.status === 429 ||
          (data.error &&
            (data.error.includes("503") ||
              data.error.includes("high demand") ||
              data.error.includes("UNAVAILABLE") ||
              data.error.includes("alta demanda")));

        if (isServerDemandError && attempt < maxRetries) {
          attempt++;
          // Wait 1.5s then retry automatically
          await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
          continue;
        }

        StorageService.logTelemetry({
          endpoint,
          duracaoMs: durationMs,
          status: "erro",
          notas: data.error || "Erro HTTP " + res.status,
        });

        const userFriendlyMsg = isServerDemandError
          ? "O servidor de IA está enfrentando alta demanda temporária do modelo. Por favor, clique novamente para tentar em instantes."
          : data.error || `Erro na requisição ${endpoint}: status ${res.status}`;

        throw new Error(userFriendlyMsg);
      }

      StorageService.logTelemetry({
        endpoint,
        duracaoMs: durationMs,
        status: "sucesso",
      });

      return data;
    } catch (err: any) {
      if (attempt < maxRetries && (err.message?.includes("fetch") || err.message?.includes("network"))) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
        continue;
      }

      const durationMs = Date.now() - startTime;
      StorageService.logTelemetry({
        endpoint,
        duracaoMs: durationMs,
        status: "erro",
        notas: err.message,
      });
      throw err;
    }
  }

  throw new Error("Não foi possível completar a requisição devido à sobrecarga temporária. Tente novamente.");
}

export const ApiService = {
  async fetchUrlContent(url: string) {
    return postJSON<{ success: boolean; url: string; extractedText: string; title?: string; message?: string }>(
      "/api/fetch-url-content",
      { url }
    );
  },

  async analyzeOffer(params: { url?: string; rawContent?: string; contextNotes?: string }): Promise<{
    success: boolean;
    analysis: OfferAnalysis;
    metadata: { durationMs: number; analyzedAt: string; url?: string };
  }> {
    return postJSON("/api/analyze-offer", params);
  },

  async generateOpportunities(params: {
    analysis: OfferAnalysis;
    customDirections?: string;
    url?: string;
  }): Promise<{
    success: boolean;
    opportunities: Opportunity[];
    metadata: { durationMs: number; url?: string };
  }> {
    return postJSON("/api/generate-opportunities", params);
  },

  async createMasterProject(params: {
    opportunity: Opportunity;
    selectedFormats: ProductFormat[];
    userCustomizations?: Record<string, any>;
    sourceUrl?: string;
  }): Promise<{
    success: boolean;
    masterProject: MasterProject;
    metadata: { durationMs: number; sourceUrl?: string };
  }> {
    return postJSON("/api/create-master-project", params);
  },

  async generateCopywriting(params: {
    masterProject: MasterProject;
    targetModule?: string;
  }): Promise<{
    success: boolean;
    copywriting: CopywritingHub;
    metadata: { durationMs: number };
  }> {
    return postJSON("/api/generate-copywriting", params);
  },

  async generateLandingPage(params: {
    masterProject: MasterProject;
    stylePreference?: string;
  }): Promise<{
    success: boolean;
    landingPage: LandingPageAsset;
    metadata: { durationMs: number };
  }> {
    return postJSON("/api/generate-landing-page", params);
  },

  async generateCreatives(params: {
    masterProject: MasterProject;
    platforms?: string[];
  }): Promise<{
    success: boolean;
    creatives: any[];
    dicasDeSegmentacao: string[];
    metadata: { durationMs: number };
  }> {
    return postJSON("/api/generate-creatives", params);
  },

  async generateFunnel(params: {
    masterProject: MasterProject;
    funnelType?: string;
  }): Promise<{
    success: boolean;
    funnel: FunnelAsset;
    metadata: { durationMs: number };
  }> {
    return postJSON("/api/generate-funnel", params);
  },

  async generateFormatAsset(params: {
    masterProject: MasterProject;
    formatType: "ebook" | "app" | "saas" | "curso" | "membros" | "microsite";
    specificOptions?: any;
  }): Promise<{
    success: boolean;
    formatType: string;
    asset: any;
    metadata: { durationMs: number };
  }> {
    return postJSON("/api/generate-format-asset", params);
  },

  async generateSequences(params: {
    masterProject: MasterProject;
    sequenceType?: string;
  }): Promise<{
    success: boolean;
    sequences: SequencesAsset;
    metadata: { durationMs: number };
  }> {
    return postJSON("/api/generate-sequences", params);
  },

  async expandProject(params: {
    masterProject: MasterProject;
  }): Promise<{
    success: boolean;
    expansions: ExpansionItem[];
    metadata: { durationMs: number };
  }> {
    return postJSON("/api/expand-project", params);
  },
};
