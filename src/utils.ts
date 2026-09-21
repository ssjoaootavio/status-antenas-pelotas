// Cores por operadora (aproximação das marcas, tons acessíveis).
export const CORES_OPERADORA: Record<string, string> = {
  Vivo: '#8b0d9e',
  Claro: '#e4002b',
  TIM: '#004691',
  Oi: '#f7a600',
};

const COR_OUTRA = '#475569';

export function corDaOperadora(op: string): string {
  return CORES_OPERADORA[op] ?? COR_OUTRA;
}

// Mapeamento tecnologia técnica -> geração.
const TECH_GERACAO: Record<string, string> = {
  GSM: '2G',
  WCDMA: '3G',
  UMTS: '3G',
  LTE: '4G',
  NR: '5G',
};

const ORDEM_GERACAO = ['2G', '3G', '4G', '5G'];

/** Converte a lista técnica (LTE, NR...) em gerações (4G, 5G...). */
export function geracoesDe(tecnologias: string[]): string[] {
  const set = new Set<string>();
  for (const t of tecnologias) {
    const g = TECH_GERACAO[t.toUpperCase()];
    if (g) set.add(g);
  }
  return ORDEM_GERACAO.filter((g) => set.has(g));
}

/** A geração mais avançada de uma antena, para rótulo/ordenação. */
export function melhorGeracao(tecnologias: string[]): string {
  const g = geracoesDe(tecnologias);
  return g[g.length - 1] ?? '—';
}

export function formatarData(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('pt-BR');
}

export function formatarDataHora(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
