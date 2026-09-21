// Busca os dados reais de Pelotas na API do RMF (Anatel/Mosaico) e grava um
// snapshot estático em public/dados-pelotas.json.
//
// Roda no BUILD (local ou GitHub Actions), nunca no navegador — assim o token
// secreto jamais é embarcado no site publicado.
//
// Token via env: RMF_TOKEN (CI) ou VITE_API_TOKEN (.env local).

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';

// Em execução local, carrega VITE_API_TOKEN do .env (no CI, RMF_TOKEN vem do
// ambiente e tem prioridade). Não falha se o .env não existir.
function carregarEnvLocal() {
  if (!existsSync('.env')) return;
  for (const linha of readFileSync('.env', 'utf8').split('\n')) {
    const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
carregarEnvLocal();

const TOKEN = process.env.RMF_TOKEN || process.env.VITE_API_TOKEN;
if (!TOKEN) {
  console.error('ERRO: defina RMF_TOKEN (ou VITE_API_TOKEN) com o token da API RMF.');
  process.exit(1);
}

const BASE = 'https://api.redesmoveisfixas.com';
const IBGE_PELOTAS = 4314407;
const HEADERS = { Authorization: `Bearer ${TOKEN}` };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(path) {
  for (;;) {
    const res = await fetch(BASE + path, { headers: HEADERS });
    if (res.status === 429) {
      const wait = Number(res.headers.get('retry-after')) || 5;
      console.log(`  429 (rajada) — aguardando ${wait}s...`);
      await sleep(wait * 1000);
      continue;
    }
    if (!res.ok) {
      throw new Error(`${path} -> ${res.status} ${await res.text()}`);
    }
    return res.json();
  }
}

// Grade de pontos cobrindo o município de Pelotas (raio de 5 km por ponto).
function gradeDePontos() {
  const pts = [];
  for (let lat = -31.86; lat <= -31.54; lat += 0.06) {
    for (let lon = -52.62; lon <= -52.1; lon += 0.06) {
      pts.push([Number(lat.toFixed(4)), Number(lon.toFixed(4))]);
    }
  }
  return pts;
}

async function main() {
  console.log('Buscando resumo do município...');
  const resumo = (await get(`/api/municipios/${IBGE_PELOTAS}/resumo`)).dados;
  console.log(
    `  Pelotas: ${resumo.totais.erbs_celular} ERBs de celular (base ${resumo.base_atualizada_em}).`,
  );

  // Operadoras de celular reconhecidas pelo resumo do município (SMP).
  // Filtra fora licenciados privados (trackers, concessionárias, etc.) que a
  // Anatel também classifica como FB, mas não são operadoras de consumidor.
  const operadorasValidas = new Set(
    resumo.por_operadora.map((o) => o.operadora.trim().toLowerCase()),
  );

  const pontos = gradeDePontos();
  console.log(`Varrendo ${pontos.length} pontos para coletar as estações...`);
  const mapa = new Map();
  let i = 0;
  for (const [lat, lon] of pontos) {
    i++;
    const dados = (await get(`/api/estacoes?lat=${lat}&lon=${lon}&limite=1000`)).dados;
    for (const e of dados.erbs) {
      if (
        e.endereco?.cidade === 'Pelotas' &&
        operadorasValidas.has(String(e.operadora).trim().toLowerCase())
      ) {
        mapa.set(e.id, e);
      }
    }
    if (i % 10 === 0) console.log(`  ${i}/${pontos.length} pontos — ${mapa.size} antenas até agora`);
    await sleep(3200); // respeita o teto de 20 req/min da rota /api/estacoes
  }

  const erbs = [...mapa.values()]
    .map((e) => ({
      id: String(e.id),
      operadora: e.operadora,
      tecnologias: e.tecnologias ?? [],
      bandas: e.bandas ?? [],
      lat: e.coordenadas?.lat,
      lon: e.coordenadas?.lon,
      logradouro: e.endereco?.logradouro ?? '',
      infraestrutura: e.estacao?.infraestrutura ?? '',
      licenciamento: e.estacao?.licenciamento ?? '',
    }))
    .filter((e) => typeof e.lat === 'number' && typeof e.lon === 'number')
    .sort((a, b) => a.operadora.localeCompare(b.operadora));

  const saida = {
    municipio: resumo.municipio,
    baseAtualizadaEm: resumo.base_atualizada_em,
    totais: resumo.totais,
    porTecnologia: resumo.por_tecnologia,
    porOperadora: resumo.por_operadora,
    fonte: resumo.fonte,
    geradoEm: new Date().toISOString(),
    erbs,
  };

  mkdirSync('public', { recursive: true });
  writeFileSync('public/dados-pelotas.json', JSON.stringify(saida));
  console.log(
    `\nOK: ${erbs.length} antenas gravadas em public/dados-pelotas.json ` +
      `(cadastro diz ${resumo.totais.erbs_celular}).`,
  );
}

main().catch((e) => {
  console.error('Falha ao gerar o snapshot:', e.message);
  process.exit(1);
});
