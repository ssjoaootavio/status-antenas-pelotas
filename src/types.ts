export type StatusAntena = 'online' | 'instavel' | 'offline';

export type Operadora = 'Vivo' | 'Claro' | 'TIM' | 'Oi';

export interface Antena {
  id: string;
  nome: string;
  bairro: string;
  operadora: Operadora;
  status: StatusAntena;
  tecnologia: string; // ex.: "4G", "5G", "4G/5G"
  lat: number;
  lng: number;
  /** ISO 8601 — momento da última leitura de status */
  atualizadoEm: string;
}

export interface Resumo {
  total: number;
  online: number;
  instavel: number;
  offline: number;
  /** % de antenas no ar (online) */
  percentualNoAr: number;
  bairrosAfetados: number;
}
