import { useState } from 'react';
import type { Novidade } from '../types';
import { corDaOperadora, geracoesDe, formatarData } from '../utils';

interface Props {
  eventos: Novidade[];
}

const LIMITE_INICIAL = 8;

export function Novidades({ eventos }: Props) {
  const [expandido, setExpandido] = useState(false);

  const visiveis = expandido ? eventos : eventos.slice(0, LIMITE_INICIAL);

  return (
    <section className="novidades">
      <div className="novidades-cabecalho">
        <h2>🆕 Novidades da rede</h2>
        <span className="novidades-contagem">
          {eventos.length > 0
            ? `${eventos.length} nos últimos meses`
            : 'nenhuma ainda'}
        </span>
      </div>

      {eventos.length === 0 ? (
        <p className="novidades-vazio">
          Ainda não há novidades registradas. A partir de agora, sempre que
          surgir uma antena nova ou um upgrade de tecnologia em Pelotas, o
          registro aparece aqui (verificado diariamente na base da Anatel).
        </p>
      ) : (
        <>
          <ul className="novidades-lista">
            {visiveis.map((n, idx) => {
              const geracoesNovas = geracoesDe(n.tecnologiasNovas);
              return (
                <li className="novidade-item" key={`${n.id}-${n.data}-${idx}`}>
                  <span
                    className={`novidade-tag ${n.tipo}`}
                    style={n.tipo === 'nova' ? { background: corDaOperadora(n.operadora) } : undefined}
                  >
                    {n.tipo === 'nova' ? 'Nova' : 'Upgrade'}
                  </span>
                  <div className="novidade-info">
                    <div className="novidade-linha1">
                      <strong>{n.operadora}</strong>
                      {n.tipo === 'upgrade' && geracoesNovas.length > 0 && (
                        <span className="novidade-ganho">
                          ganhou {geracoesNovas.join(', ')}
                        </span>
                      )}
                    </div>
                    <div className="novidade-linha2">
                      {n.logradouro || 'Endereço não informado'}
                    </div>
                  </div>
                  <span className="novidade-data">{formatarData(n.data)}</span>
                </li>
              );
            })}
          </ul>
          {eventos.length > LIMITE_INICIAL && (
            <button className="novidades-toggle" onClick={() => setExpandido((v) => !v)}>
              {expandido ? 'Ver menos' : `Ver todas (${eventos.length})`}
            </button>
          )}
        </>
      )}
    </section>
  );
}
