import { useMemo, useState } from 'react';
import { useDados } from './hooks/useDados';
import { useNovidades } from './hooks/useNovidades';
import { ResumoAntenas } from './components/ResumoAntenas';
import { Novidades } from './components/Novidades';
import { Filtros, type EstadoFiltros } from './components/Filtros';
import { ListaAntenas } from './components/ListaAntenas';
import { MapaAntenas } from './components/MapaAntenas';
import { formatarData, formatarDataHora, geracoesDe } from './utils';

const FILTROS_INICIAIS: EstadoFiltros = { operadora: '', geracao: '', busca: '' };

export default function App() {
  const { dados, carregando, erro } = useDados();
  const novidades = useNovidades();
  const [filtros, setFiltros] = useState<EstadoFiltros>(FILTROS_INICIAIS);
  const [selecionada, setSelecionada] = useState<string | null>(null);

  const antenas = dados?.erbs ?? [];

  const operadoras = useMemo(
    () => [...new Set(antenas.map((a) => a.operadora))].sort(),
    [antenas],
  );

  const filtradas = useMemo(() => {
    const busca = filtros.busca.trim().toLowerCase();
    return antenas.filter((a) => {
      if (filtros.operadora && a.operadora !== filtros.operadora) return false;
      if (filtros.geracao && !geracoesDe(a.tecnologias).includes(filtros.geracao))
        return false;
      if (busca) {
        const alvo = `${a.operadora} ${a.id} ${a.logradouro}`.toLowerCase();
        if (!alvo.includes(busca)) return false;
      }
      return true;
    });
  }, [antenas, filtros]);

  return (
    <div className="app">
      <header className="topo">
        <div className="topo-titulo">
          <h1>📡 Antenas de Celular · Pelotas</h1>
          <p>Mapa das estações (ERBs) licenciadas na Anatel · dados via Redes Móveis Fixas</p>
        </div>
        {dados && (
          <div className="topo-meta">
            <span className="atualizado-em">
              Base Anatel de {formatarData(dados.baseAtualizadaEm)}
            </span>
          </div>
        )}
      </header>

      {carregando && <div className="aviso">Carregando dados…</div>}
      {erro && <div className="erro">{erro}</div>}

      {dados && (
        <>
          <ResumoAntenas antenas={filtradas} />

          <Novidades eventos={novidades} />

          <Filtros filtros={filtros} operadoras={operadoras} onChange={setFiltros} />

          <main className="conteudo">
            <section className="painel-mapa">
              <MapaAntenas
                antenas={filtradas}
                selecionada={selecionada}
                onSelecionar={setSelecionada}
              />
            </section>
            <aside className="painel-lista">
              <div className="lista-cabecalho">
                {filtradas.length} de {antenas.length} antenas
              </div>
              <ListaAntenas
                antenas={filtradas}
                selecionada={selecionada}
                onSelecionar={setSelecionada}
              />
            </aside>
          </main>

          <footer className="rodape">
            Fonte: {dados.fonte}. Snapshot coletado em {formatarDataHora(dados.geradoEm)}.
            Mostra onde as antenas <b>estão licenciadas</b> — não é medição de sinal
            em tempo real nem indica quedas.
          </footer>
        </>
      )}
    </div>
  );
}
