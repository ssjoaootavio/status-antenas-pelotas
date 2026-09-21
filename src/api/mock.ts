import type { Antena, Operadora, StatusAntena } from '../types';

// Bairros de Pelotas com coordenadas aproximadas (centro do bairro).
const BAIRROS: { nome: string; lat: number; lng: number }[] = [
  { nome: 'Centro', lat: -31.7719, lng: -52.3425 },
  { nome: 'Fragata', lat: -31.755, lng: -52.356 },
  { nome: 'Três Vendas', lat: -31.745, lng: -52.335 },
  { nome: 'Areal', lat: -31.785, lng: -52.33 },
  { nome: 'Porto', lat: -31.765, lng: -52.355 },
  { nome: 'São Gonçalo', lat: -31.735, lng: -52.305 },
  { nome: 'Simões Lopes', lat: -31.73, lng: -52.345 },
  { nome: 'Dunas', lat: -31.795, lng: -52.305 },
  { nome: 'Laranjal', lat: -31.8, lng: -52.22 },
  { nome: 'Barragem', lat: -31.74, lng: -52.36 },
];

const OPERADORAS: Operadora[] = ['Vivo', 'Claro', 'TIM', 'Oi'];
const TECNOLOGIAS = ['4G', '5G', '4G/5G'];

function jitter(v: number, amp = 0.006): number {
  return v + (Math.random() - 0.5) * amp;
}

function sorteiaStatus(): StatusAntena {
  const r = Math.random();
  // Cenário de contingência: mais offline/instável do que o normal.
  if (r < 0.55) return 'online';
  if (r < 0.78) return 'instavel';
  return 'offline';
}

// Base gerada uma única vez por sessão; as leituras seguintes apenas
// evoluem alguns status para simular um feed "ao vivo".
let base: Antena[] | null = null;

function gerarBase(): Antena[] {
  const lista: Antena[] = [];
  let seq = 1;
  for (const bairro of BAIRROS) {
    const qtd = 3 + Math.floor(Math.random() * 3); // 3 a 5 antenas por bairro
    for (let i = 0; i < qtd; i++) {
      const operadora = OPERADORAS[Math.floor(Math.random() * OPERADORAS.length)];
      lista.push({
        id: `PEL-${String(seq).padStart(3, '0')}`,
        nome: `ERB ${bairro.nome} ${i + 1}`,
        bairro: bairro.nome,
        operadora,
        status: sorteiaStatus(),
        tecnologia: TECNOLOGIAS[Math.floor(Math.random() * TECNOLOGIAS.length)],
        lat: jitter(bairro.lat),
        lng: jitter(bairro.lng),
        atualizadoEm: new Date().toISOString(),
      });
      seq++;
    }
  }
  return lista;
}

/**
 * Simula uma leitura da API. Na primeira chamada gera a base;
 * nas seguintes, muda o status de algumas antenas (recuperação/queda)
 * para que o auto-refresh mostre o painel "vivo".
 */
export async function gerarAntenasMock(): Promise<Antena[]> {
  // Pequena latência para parecer uma chamada de rede real.
  await new Promise((r) => setTimeout(r, 200));

  if (!base) {
    base = gerarBase();
    return base.map((a) => ({ ...a }));
  }

  const agora = new Date().toISOString();
  const mudancas = 1 + Math.floor(Math.random() * 3); // 1 a 3 antenas mudam
  for (let i = 0; i < mudancas; i++) {
    const idx = Math.floor(Math.random() * base.length);
    const novoStatus = sorteiaStatus();
    if (novoStatus !== base[idx].status) {
      base[idx] = { ...base[idx], status: novoStatus, atualizadoEm: agora };
    }
  }

  return base.map((a) => ({ ...a }));
}
