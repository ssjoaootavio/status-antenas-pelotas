export interface EstadoFiltros {
  operadora: string;
  geracao: string;
  busca: string;
}

interface Props {
  filtros: EstadoFiltros;
  operadoras: string[];
  onChange: (f: EstadoFiltros) => void;
}

const GERACOES = ['2G', '3G', '4G', '5G'];

export function Filtros({ filtros, operadoras, onChange }: Props) {
  function set<K extends keyof EstadoFiltros>(chave: K, valor: EstadoFiltros[K]) {
    onChange({ ...filtros, [chave]: valor });
  }

  return (
    <div className="filtros">
      <input
        type="search"
        placeholder="Buscar por rua, ID ou operadora…"
        value={filtros.busca}
        onChange={(e) => set('busca', e.target.value)}
        className="filtro-busca"
      />

      <select value={filtros.operadora} onChange={(e) => set('operadora', e.target.value)}>
        <option value="">Todas as operadoras</option>
        {operadoras.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>

      <select value={filtros.geracao} onChange={(e) => set('geracao', e.target.value)}>
        <option value="">Todas as tecnologias</option>
        {GERACOES.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  );
}
