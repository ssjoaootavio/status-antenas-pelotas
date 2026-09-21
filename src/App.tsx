import { useMemo, useState } from 'react';
import { usandoMock } from './api/antenas';
import { useAntenas } from './hooks/useAntenas';
import { ResumoStatus } from './components/ResumoStatus';
import { Filtros, type EstadoFiltros } from './components/Filtros';
import { ListaAntenas } from './components/ListaAntenas';
import { MapaAntenas } from './components/MapaAntenas';
import { calcularResumo, formatarHora } from './utils';
import type { Operadora } from './types';

const FILTROS_INICIAIS: EstadoFiltros = {
  bairro: '',
  operadora: '',
  status: '',
  busca: '',
};

export default function App() {
  const { antenas, carregando, erro, ultimaAtualizacao, recarregar } =
    useAntenas(15000);
  const [filtros, setFiltros] = useState<EstadoFiltros>(FILTROS_INICIAIS);
  const [selecionada, setSelecionada] = useState<string | null>(null);

  const bairros = useMemo(
    () => [...new Set(antenas.map((a) => a.bairro))].sort(),
    [antenas],
  );
  const operadoras = useMemo(
    () => [...new Set(antenas.map((a) => a.operadora))].sort() as Operadora[],
    [antenas],
  );

  const filtradas = useMemo(() => {
    const busca = filtros.busca.trim().toLowerCase();
    return antenas.filter((a) => {
      if (filtros.bairro && a.bairro !== filtros.bairro) return false;
      if (filtros.operadora && a.operadora !== filtros.operadora) return false;
      if (filtros.status && a.status !== filtros.status) return false;
      if (busca) {
        const alvo = `${a.bairro} ${a.id} ${a.operadora} ${a.nome}`.toLowerCase();
        if (!alvo.includes(busca)) return false;
      }
      return true;
    });
  }, [antenas, filtros]);

  const resumo = useMemo(() => calcularResumo(filtradas), [filtradas]);

  return (
    <div className="app">
      <header className="topo">
        <div className="topo-titulo">
          <h1>📡 Status das Antenas · Pelotas</h1>
          <p>Monitoramento de sinal de celular durante a contingência</p>
        </div>
        <div className="topo-meta">
          {usandoMock() && <span className="tag-mock">dados simulados</span>}
          <button className="btn-atualizar" onClick={recarregar} disabled={carregando}>
            {carregando ? 'Atualizando…' : '↻ Atualizar'}
          </button>
          {ultimaAtualizacao && (
            <span className="atualizado-em">
              última leitura {formatarHora(ultimaAtualizacao.toISOString())}
            </span>
          )}
        </div>
      </header>

      {erro && (
        <div className="erro">
          Erro ao consultar a API: {erro}. Verifique o endpoint e o token no
          arquivo <code>.env</code>.
        </div>
      )}

      <ResumoStatus resumo={resumo} />

      <Filtros
        filtros={filtros}
        bairros={bairros}
        operadoras={operadoras}
        onChange={setFiltros}
      />

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
            {filtradas.length} antena{filtradas.length !== 1 ? 's' : ''}
          </div>
          <ListaAntenas
            antenas={filtradas}
            selecionada={selecionada}
            onSelecionar={setSelecionada}
          />
        </aside>
      </main>

      <footer className="rodape">
        Dados exibidos para fins de monitoramento. Localizações e status são
        {usandoMock() ? ' simulados ' : ' fornecidos pela API '}
        e podem não refletir a situação real da rede.
      </footer>
    </div>
  );
}
