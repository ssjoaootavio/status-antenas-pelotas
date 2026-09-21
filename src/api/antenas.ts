import type { Antena, Operadora, StatusAntena } from '../types';
import { gerarAntenasMock } from './mock';

const USE_MOCK = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_USE_MOCK !== 'false'
  : true; // sem URL configurada, sempre mock

const API_URL = import.meta.env.VITE_API_URL ?? '';
const API_TOKEN = import.meta.env.VITE_API_TOKEN ?? '';
const AUTH_MODE = (import.meta.env.VITE_API_AUTH_MODE ?? 'bearer') as
  | 'bearer'
  | 'x-api-key'
  | 'query';

export function usandoMock(): boolean {
  return USE_MOCK;
}

/**
 * Busca as antenas. Enquanto VITE_USE_MOCK !== 'false' (ou sem URL),
 * retorna dados simulados. Caso contrário, consome a API real.
 */
export async function fetchAntenas(): Promise<Antena[]> {
  if (USE_MOCK) {
    return gerarAntenasMock();
  }

  const url = montarUrl(API_URL);
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (AUTH_MODE === 'bearer' && API_TOKEN) {
    headers.Authorization = `Bearer ${API_TOKEN}`;
  } else if (AUTH_MODE === 'x-api-key' && API_TOKEN) {
    headers['X-API-Key'] = API_TOKEN;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`API respondeu ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return normalizarResposta(data);
}

function montarUrl(base: string): string {
  if (AUTH_MODE === 'query' && API_TOKEN) {
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}token=${encodeURIComponent(API_TOKEN)}`;
  }
  return base;
}

/**
 * Aceita tanto um array direto quanto um objeto com uma chave
 * ("antenas", "data", "items", "results") e normaliza cada item.
 * >>> Ajustar aqui quando o formato real for conhecido. <<<
 */
function normalizarResposta(data: unknown): Antena[] {
  const lista = extrairLista(data);
  return lista.map(normalizarAntena).filter((a): a is Antena => a !== null);
}

function extrairLista(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    for (const chave of ['antenas', 'data', 'items', 'results', 'stations']) {
      if (Array.isArray(obj[chave])) return obj[chave] as unknown[];
    }
  }
  return [];
}

function normalizarAntena(raw: unknown): Antena | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;

  const lat = num(o.lat ?? o.latitude ?? o.lat_gcs);
  const lng = num(o.lng ?? o.lon ?? o.longitude ?? o.long);
  if (lat === null || lng === null) return null;

  return {
    id: str(o.id ?? o.codigo ?? o.station_id) || cryptoId(),
    nome: str(o.nome ?? o.name ?? o.estacao) || 'ERB',
    bairro: str(o.bairro ?? o.neighborhood ?? o.regiao) || 'Não informado',
    operadora: normalizarOperadora(o.operadora ?? o.carrier ?? o.operator),
    status: normalizarStatus(o.status ?? o.estado ?? o.state),
    tecnologia: str(o.tecnologia ?? o.tech ?? o.technology) || '—',
    lat,
    lng,
    atualizadoEm:
      str(o.atualizadoEm ?? o.updated_at ?? o.timestamp) ||
      new Date().toISOString(),
  };
}

function normalizarStatus(v: unknown): StatusAntena {
  const s = String(v ?? '').toLowerCase();
  if (['online', 'up', 'ok', 'no ar', 'ativo', 'ativa'].includes(s))
    return 'online';
  if (['offline', 'down', 'fora', 'fora do ar', 'inativo', 'inativa'].includes(s))
    return 'offline';
  if (['instavel', 'instável', 'unstable', 'degraded', 'degradado'].includes(s))
    return 'instavel';
  return 'offline';
}

function normalizarOperadora(v: unknown): Operadora {
  const s = String(v ?? '').toLowerCase();
  if (s.includes('vivo')) return 'Vivo';
  if (s.includes('claro')) return 'Claro';
  if (s.includes('tim')) return 'TIM';
  if (s.includes('oi')) return 'Oi';
  return 'Vivo';
}

function num(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function str(v: unknown): string {
  return v === null || v === undefined ? '' : String(v);
}

function cryptoId(): string {
  return 'ERB-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}
