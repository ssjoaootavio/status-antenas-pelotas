import type { DadosPelotas } from '../types';

/**
 * Carrega o snapshot estático gerado no build (public/dados-pelotas.json).
 * Nenhum token é usado no navegador — o dado já vem pronto e público.
 */
export async function carregarDados(): Promise<DadosPelotas> {
  const url = `${import.meta.env.BASE_URL}dados-pelotas.json`;
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) {
    throw new Error(
      `Não foi possível carregar os dados (${res.status}). ` +
        'Rode "npm run fetch" para gerar o snapshot.',
    );
  }
  return res.json();
}
