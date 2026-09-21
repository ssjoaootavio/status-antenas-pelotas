import type { Antena } from '../types';
import { corDaOperadora, geracoesDe } from '../utils';

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
            style={{ backgroundColor: corDaOperadora(a.operadora) }}
            title={a.operadora}
          />
          <div className="lista-info">
            <div className="lista-linha1">
              <strong>{a.operadora}</strong>
              <span className="lista-geracoes">
                {geracoesDe(a.tecnologias).map((g) => (
                  <span className="badge-geracao" key={g}>
                    {g}
                  </span>
                ))}
              </span>
            </div>
            <div className="lista-linha2">{a.logradouro || 'Endereço não informado'}</div>
            <div className="lista-linha3">
              ID {a.id}
              {a.infraestrutura ? ` · ${a.infraestrutura}` : ''}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
