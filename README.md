# Antenas de Celular · Pelotas

Painel web com o **mapa das antenas de celular (ERBs) de Pelotas**, a partir do
cadastro da **Anatel (Mosaico)** servido pela API do
[Redes Móveis Fixas (RMF)](https://redesmoveisfixas.com/createapi). Mostra mapa,
resumo por operadora/tecnologia e lista filtrável.

> **O que este painel é (e o que não é).** Ele mostra **onde as antenas estão
> licenciadas** e quais tecnologias (2G/3G/4G/5G) cada uma tem. **Não** é medição
> de sinal em tempo real e **não** indica quais antenas estão fora do ar — esse
> dado não existe publicamente. A camada de cobertura da Anatel é modelada, não
> medida.

## Stack

- **Vite + React + TypeScript**
- **Leaflet** + OpenStreetMap (mapa, sem chave)

## Como os dados chegam (e por que o token fica seguro)

O token da API do RMF é **secreto** e não pode ir para um site estático público.
Como o cadastro da Anatel **não é tempo real** (atualiza ~1x/dia), os dados são
buscados no **build**, não no navegador:

1. `scripts/fetch-dados.mjs` roda no build, usa o token e varre Pelotas.
2. Grava um snapshot público em `public/dados-pelotas.json`.
3. O site (estático) apenas lê esse JSON. **O token nunca chega ao navegador.**

No GitHub Actions, o token entra como o **secret `RMF_TOKEN`** do repositório, e
um agendamento diário mantém o snapshot atualizado.

## Rodar localmente

```bash
npm install

# 1) gere o snapshot (precisa do token no .env — veja .env.example)
npm run fetch

# 2) suba o painel
npm run dev
```

O `.env` (com o token) está no `.gitignore` e nunca é versionado.

## Deploy

Push na `main` dispara o workflow (`.github/workflows/deploy.yml`), que busca os
dados, faz o build e publica no GitHub Pages.

Configurar o secret uma vez:

```bash
gh secret set RMF_TOKEN --repo ssjoaootavio/status-antenas-pelotas
```

## Estrutura

```
scripts/fetch-dados.mjs   # coleta o snapshot da Anatel/RMF (roda no build)
public/dados-pelotas.json # snapshot público consumido pelo site
src/
  api/dados.ts            # carrega o snapshot
  components/             # Mapa, Resumo, Lista, Filtros
  hooks/useDados.ts
  types.ts
  utils.ts
```

Fonte dos dados: Anatel (Mosaico) via Redes Móveis Fixas.
