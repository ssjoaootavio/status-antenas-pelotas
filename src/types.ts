export interface Antena {
  id: string;
  operadora: string;
  /** nomes técnicos: GSM, WCDMA, UMTS, LTE, NR */
  tecnologias: string[];
  bandas: string[];
  lat: number;
  lon: number;
  logradouro: string;
  infraestrutura: string;
  /** data de licenciamento (ISO ou YYYY-MM-DD) */
  licenciamento: string;
}

export interface PorOperadora {
  operadora: string;
  erbs: number;
  tecnologias: Record<string, number>;
}

export interface DadosPelotas {
  municipio: { codigo_ibge: number; nome: string; uf: string };
  /** quando a base da Anatel foi gerada */
  baseAtualizadaEm: string;
  totais: { estacoes: number; erbs_celular: number; outras_estacoes: number };
  porTecnologia: Record<string, number>;
  porOperadora: PorOperadora[];
  fonte: string;
  /** quando este snapshot foi coletado */
  geradoEm: string;
  erbs: Antena[];
}
