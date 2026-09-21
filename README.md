# Status das Antenas · Pelotas

Painel web para acompanhar o status das antenas de celular (ERBs) em Pelotas
durante uma contingência (ex.: queda de sinal após temporal). Mostra um **mapa**,
um **resumo** (% no ar, instáveis, fora do ar, bairros afetados) e uma **lista
filtrável** por bairro, operadora e status, com **auto-refresh**.

## Stack

- **Vite + React + TypeScript**
- **Leaflet** + OpenStreetMap (mapa, sem chave de API)

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. Por padrão usa **dados simulados (mock)**.

## Dados: mock vs. API real

A configuração fica em `.env` (copie de `.env.example`):

| Variável             | Descrição                                                        |
| -------------------- | ---------------------------------------------------------------- |
| `VITE_USE_MOCK`      | `true` usa mock; `false` consome a API real                      |
| `VITE_API_URL`       | endpoint que **lista** as antenas (retorna o JSON com status)    |
| `VITE_API_TOKEN`     | token de acesso                                                  |
| `VITE_API_AUTH_MODE` | `bearer`, `x-api-key` ou `query` (como o token é enviado)        |

Para ligar a API real: preencha `VITE_API_URL`, defina `VITE_USE_MOCK=false` e,
se necessário, ajuste o mapeamento de campos em
[`src/api/antenas.ts`](src/api/antenas.ts) (função `normalizarAntena`).

## ⚠️ Segurança do token

Qualquer variável `VITE_*` é **embutida no JavaScript do navegador** no build —
ou seja, fica **visível para qualquer usuário**. Se o token for secreto, ele
**não** deve ir para o frontend em produção. Nesse caso, use um **proxy/backend**
(uma pequena função serverless ou o `server.proxy` do Vite) que guarda o token no
servidor e repassa a chamada. Para desenvolvimento local, o `.env` já resolve.

O arquivo `.env` está no `.gitignore` e nunca deve ser versionado.

## Estrutura

```
src/
  api/
    antenas.ts   # camada de acesso (mock/real) + normalização
    mock.ts      # gerador de dados simulados de Pelotas
  components/    # Mapa, Resumo, Lista, Filtros
  hooks/
    useAntenas.ts # busca + auto-refresh
  types.ts
  utils.ts
```
