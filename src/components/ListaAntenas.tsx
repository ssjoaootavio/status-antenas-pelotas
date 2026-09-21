import type { Antena } from '../types';
import { CORES_STATUS, LABEL_STATUS, tempoRelativo } from '../utils';

interface Props {
  antenas: Antena[];
  selecionada: string | null;
  onSelecionar: (id: string) => void;
}

export function ListaAntenas({ antenas, selecionada, onSelecionar }: Props) {
  if (antenas.length === 0) {
    return <p className="lista-vazia">Nenhuma antena para os filtros atuais.</p>;
  }

  return (
    <ul className="lista">
      {antenas.map((a) => (
        <li
          key={a.id}
          className={`lista-item ${selecionada === a.id ? 'ativo' : ''}`}
          onClick={() => onSelecionar(a.id)}
        >
          <span
            className="ponto-status"
            style={{ backgroundColor: CORES_STATUS[a.status] }}
            title={LABEL_STATUS[a.status]}
          />
          <div className="lista-info">
            <div className="lista-linha1">
              <strong>{a.bairro}</strong>
              <span className="lista-operadora">{a.operadora}</span>
            </div>
            <div className="lista-linha2">
              <span>
                {a.id} · {a.tecnologia}
              </span>
              <span
                className="lista-badge"
                style={{ color: CORES_STATUS[a.status] }}
              >
                {LABEL_STATUS[a.status]}
              </span>
            </div>
            <div className="lista-linha3">
              atualizado {tempoRelativo(a.atualizadoEm)}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
