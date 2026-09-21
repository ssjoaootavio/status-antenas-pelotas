import type { Operadora, StatusAntena } from '../types';
import { LABEL_STATUS } from '../utils';

export interface EstadoFiltros {
  bairro: string;
  operadora: string;
  status: string;
  busca: string;
}

interface Props {
  filtros: EstadoFiltros;
  bairros: string[];
  operadoras: Operadora[];
  onChange: (f: EstadoFiltros) => void;
}

const STATUS_OPCOES: StatusAntena[] = ['online', 'instavel', 'offline'];

export function Filtros({ filtros, bairros, operadoras, onChange }: Props) {
  function set<K extends keyof EstadoFiltros>(chave: K, valor: EstadoFiltros[K]) {
    onChange({ ...filtros, [chave]: valor });
  }

  return (
    <div className="filtros">
      <input
        type="search"
        placeholder="Buscar por bairro, ID ou operadora…"
        value={filtros.busca}
        onChange={(e) => set('busca', e.target.value)}
        className="filtro-busca"
      />

      <select value={filtros.bairro} onChange={(e) => set('bairro', e.target.value)}>
        <option value="">Todos os bairros</option>
        {bairros.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <select
        value={filtros.operadora}
        onChange={(e) => set('operadora', e.target.value)}
      >
        <option value="">Todas as operadoras</option>
        {operadoras.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>

      <select value={filtros.status} onChange={(e) => set('status', e.target.value)}>
        <option value="">Todos os status</option>
        {STATUS_OPCOES.map((s) => (
          <option key={s} value={s}>
            {LABEL_STATUS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}
