import type { Antena, Resumo, StatusAntena } from './types';

export const CORES_STATUS: Record<StatusAntena, string> = {
  online: '#16a34a', // verde
  instavel: '#f59e0b', // âmbar
  offline: '#dc2626', // vermelho
};

export const LABEL_STATUS: Record<StatusAntena, string> = {
  online: 'No ar',
  instavel: 'Instável',
  offline: 'Fora do ar',
};

export function corDoStatus(status: StatusAntena): string {
  return CORES_STATUS[status];
}

export function calcularResumo(antenas: Antena[]): Resumo {
  const total = antenas.length;
  let online = 0;
  let instavel = 0;
  let offline = 0;
  const bairrosComProblema = new Set<string>();

  for (const a of antenas) {
    if (a.status === 'online') online++;
    else if (a.status === 'instavel') {
      instavel++;
      bairrosComProblema.add(a.bairro);
    } else {
      offline++;
      bairrosComProblema.add(a.bairro);
    }
  }

  return {
    total,
    online,
    instavel,
    offline,
    percentualNoAr: total === 0 ? 0 : Math.round((online / total) * 100),
    bairrosAfetados: bairrosComProblema.size,
  };
}

export function formatarHora(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/** "há 12s", "há 3min" — tempo relativo curto para o feed */
export function tempoRelativo(iso: string, agora = Date.now()): string {
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return '—';
  const seg = Math.max(0, Math.round((agora - d) / 1000));
  if (seg < 60) return `há ${seg}s`;
  const min = Math.round(seg / 60);
  if (min < 60) return `há ${min}min`;
  const h = Math.round(min / 60);
  return `há ${h}h`;
}
