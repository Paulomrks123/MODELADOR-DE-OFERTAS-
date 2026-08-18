export type ProductFormat =
  | "E-book"
  | "Microsite"
  | "Landing Page"
  | "Curso"
  | "Área de membros"
  | "Aplicativo"
  | "SaaS"
  | "Comunidade"
  | "Serviço"
  | "Produto híbrido";

export interface AvatarProfile {
  perfil?: string;
  nome?: string;
  perfilDemografico?: string;
  momentoVidaContexto?: string;
  dores?: string[];
  doresProfundas?: string[];
  desejos?: string[];
  desejosSecretos?: string[];
  medos?: string[];
  medosInconfessaveis?: string[];
  medosInconfessiveis?: string[];
  objecoes?: string[];
  principaisObjecoes?: string[];
  objecoesComuns?: string[];
  inimigoComum?: string;
  linguagemETermoChave?: string[];
  linguagemTermosChave?: string[];
}

export interface OfferScore {
  geral: number;
  clarezaOferta: number;
  forcaPromessa: number;
  clarezaPublico: number;
  diferenciacao: number;
  potencialComercial: number;
  estruturaFunil: number;
  potencialRecorrencia: number;
  potencialExpansao: number;
  facilidadeCriacao: number;
  potencialAquisicao: number;
  parecerEstrategico: string;
}

export interface OfferAnalysis {
  nicho: string;
  subnicho: string;
  publicoAlvo: string;
  avatar: AvatarProfile;
  problemaPrincipal: string;
  transformacaoPrometida: string;
  propostaValor: string;
  mecanismoOferta: string;
  diferencial: string;
  estruturaOferta: {
    produtos: string[];
    bonus: string[];
    garantia: string;
    cta: string;
    estrategiaPreco: string;
    modeloMonetizacao: string;
  };
  funilProvavel: {
    tipo: string;
    leadMagnet: string;
    orderBump: string;
    upsell: string;
    downsell: string;
  };
  estrategiaAquisicao: {
    angulosMarketing: string[];
    gatilhosUtilizados: string[];
    elementosProvaSocial: string[];
  };
  diagnostico: {
    pontosFortes: string[];
    pontosFracos: string[];
    oportunidadesDiferenciacao: string[];
  };
  score: OfferScore;
  oportunidades?: Opportunity[];
}

export interface Opportunity {
  id: string;
  nomeProvisorio: string;
  tagline?: string;
  nicho: string;
  subnicho?: string;
  publico: string;
  problema: string;
  desejo: string;
  solucaoProposta: string;
  mecanismoUnico?: string;
  diferencial: string;
  formatoRecomendado: string;
  modeloMonetizacao: string;
  faixaPrecoSugerida: string;
  complexidade: "Baixa" | "Média" | "Alta" | string;
  potencialExpansao: string;
  justificativaEstrategica: string;
  anguloInovacao?: string;
}

export interface MasterProject {
  id: string;
  nomeProduto: string;
  slug: string;
  nicho: string;
  subnicho: string;
  bigIdea: string;
  posicionamento: string;
  propostaUnicaValor: string;
  mecanismoUnico: {
    nome: string;
    explicacao: string;
  };
  promessaPrincipal: string;
  promessasSecundarias?: string[];
  avatar: AvatarProfile;
  oferta: {
    nomeOferta?: string;
    precoPrincipal: string;
    modeloMonetizacao?: string;
    ancoragem?: string;
    garantia?: string;
    urgencia?: string;
    escassez?: string;
    escassezEtica?: string;
    ctaPrincipal: string;
    bonusExclusivos?: Array<{
      titulo: string;
      valorPercebido?: string;
      descricao?: string;
    }>;
  };
  formatosEscolhidos: ProductFormat[];
  tomDeVoz?: string;
  estrategiaFunil?: {
    modeloPrincipal?: string;
    resumoEtapas?: string[];
    sugestaoOrderBump?: string;
    sugestaoUpsell?: string;
    sugestaoDownsell?: string;
  };
  regrasMemoria: string[];
  createdAt: string;
  updatedAt: string;
  sourceUrl?: string;
}

export interface CopywritingHub {
  headlines: {
    diretas: string[];
    curiosidade: string[];
    beneficio: string[];
    problema: string[];
    transformacao: string[];
    especificas: string[];
    anuncios: string[];
  };
  subheadlines: string[];
  ctas: {
    diretos: string[];
    comBeneficio: string[];
    comUrgencia: string[];
    baixoAtrito: string[];
  };
  bulletsPersuasivos: Array<{
    icone?: string;
    fascinio: string;
    explicacao: string;
  }>;
  quebraObjecoes: Array<{
    objecao: string;
    respostaCopy: string;
    tecnica: string;
  }>;
  provasEArgumentos: Array<{
    pilar: string;
    argumentoLogico: string;
    analogia: string;
  }>;
  microCopies: {
    garantiaBadge: string;
    urgenciaTimer: string;
    checkoutSeguro: string;
  };
}

export interface LandingPageSection {
  id: number;
  tag?: string;
  title: string;
  badge?: string;
  headline?: string;
  subheadline?: string;
  heading?: string;
  ctaText?: string;
  ctaSubtext?: string;
  bulletPoints?: string[];
  narrativa?: string;
  sintomas?: string[];
  cenarioNegativo?: string;
  custoDeNaoAgir?: string;
  nomeSolucao?: string;
  explicacaoMecanismo?: string;
  pontosChave?: string[];
  items?: Array<{ titulo: string; descricao: string }>;
  steps?: Array<{ stepNumber: number; titulo: string; descricao: string }>;
  comparativo?: Array<{ outros: string; esteProduto: string }>;
  modulosOuItens?: Array<{ nome: string; resumo: string; valorEstimado: string }>;
  bonusList?: Array<{ titulo: string; descricao: string; valor: string }>;
  diasGarantia?: string;
  textoGarantia?: string;
  precoAncorado?: string;
  precoAtual?: string;
  parcelamento?: string;
  garantiaBadge?: string;
  faqs?: Array<{ pergunta: string; resposta: string }>;
  texto?: string;
  alertaEscassez?: string;
}

export interface LandingPageAsset {
  meta?: {
    pageTitle?: string;
    metaDescription?: string;
    primaryColor?: string;
  };
  sections: LandingPageSection[];
}

export interface CreativeItem {
  id?: string;
  formato: string;
  angulo: string;
  hook: string;
  headline?: string;
  textoPrincipal?: string;
  primaryText?: string;
  ctaRecomendado?: string;
  cta?: string;
  ideiaVisual: string;
  roteiroCompleto?: string;
  slides?: string[];
  publicoRecomendado?: string;
}

export interface CreativesAsset {
  creatives: CreativeItem[];
  dicasDeSegmentacao: string[];
}

export interface FunnelStepItem {
  step: number;
  nome: string;
  tipo: "Trafego" | "LandingPage" | "Checkout" | "OrderBump" | "Upsell" | "Downsell" | "Entrega" | string;
  acaoEsperada: string;
  taxaConversaoMediaEstimada: string;
}

export interface FunnelAsset {
  tipoFunil: string;
  descricaoEstrategica?: string;
  etapas?: FunnelStepItem[];
  orderBump: {
    titulo?: string;
    nome?: string;
    precoSugerido?: string;
    preco?: string;
    promessa?: string;
    entregavel?: string;
    beneficioChave?: string;
    copyCheckbox: string;
    justificativaEstrategica?: string;
    relacaoProdutoPrincipal?: string;
  };
  upsell1?: {
    titulo?: string;
    precoSugerido?: string;
    headlinePagina?: string;
    roteiroVideo?: string;
    justificativa?: string;
  };
  upsell?: {
    nome?: string;
    preco?: string;
    headline?: string;
    beneficios?: string[];
    ctaAceitar?: string;
    ctaRecusar?: string;
    argumentacaoCopy?: string;
  };
  downsell1?: {
    titulo?: string;
    precoSugerido?: string;
    proposta?: string;
    diferenca?: string;
  };
  downsell?: {
    nome?: string;
    preco?: string;
    ofertaReduzida?: string;
    copy?: string;
    cta?: string;
    justificativa?: string;
  };
}

export interface FormatAssetData {
  formatType: string;
  asset: any;
}

export interface SequencesAsset {
  emailsCaptura?: Array<{ assunto: string; objetivo?: string; corpo: string; cta?: string }>;
  emailsLancamento?: Array<{ diaDisparo?: string; assunto: string; objetivo?: string; corpo: string; cta?: string }>;
  emails?: {
    captura: Array<{ assunto: string; preHeader: string; corpo: string; cta: string }>;
    vendas: Array<{ dia: number; assunto: string; angulo: string; corpo: string; cta: string }>;
    posCompra: Array<{ assunto: string; gatilho: string; corpo: string }>;
  };
  whatsapp: {
    boasVindas?: string;
    qualificacao?: string;
    followUp?: string;
    carrinhoAbandonado?: string;
    quebraObjecao?: string;
    posVenda?: string;
    [key: string]: any;
  };
  scriptsVendas: {
    whatsapp1a1?: string;
    directInstagram?: string;
    vslRoteiro?: string;
    pitchLigacao?: string;
    [key: string]: any;
  };
}

export interface ExpansionItem {
  tipo: string;
  nome?: string;
  titulo?: string;
  descricao?: string;
  proposta?: string;
  justificativa?: string;
  potencialFaturamento?: string;
  precosSugeridos?: string;
  sinergiaComProjetoAtual: string;
}

export interface ProjectMemoryFact {
  id: string;
  chave: string;
  valor: string;
  categoria: "avatar" | "posicionamento" | "oferta" | "mecanismo" | "regra_inviolavel" | "assets";
  status: "aprovado" | "pendente" | "bloqueado";
  atualizadoEm: string;
}

export interface TelemetryLog {
  id: string;
  endpoint: string;
  duracaoMs: number;
  status: "sucesso" | "erro";
  timestamp: string;
  feedback?: "👍" | "👎" | "⭐" | "✏️" | "🔄" | string;
  notas?: string;
}

export type MainTab =
  | "dashboard"
  | "modelador"
  | "oportunidades"
  | "formato_projeto"
  | "copywriting"
  | "landing_page"
  | "criativos"
  | "funil"
  | "formatos_especificos"
  | "emails_whatsapp"
  | "inteligencia_memoria"
  | "expansao"
  | "modo_interno";
