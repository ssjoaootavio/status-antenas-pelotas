import { useMemo } from 'react';
import type { Antena } from '../types';
import { corDaOperadora, geracoesDe } from '../utils';

interface Props {
  antenas: Antena[];
}

export function ResumoAntenas({ antenas }: Props) {
  const stats = useMemo(() => {
    let com4G = 0;
    let com5G = 0;
    const porOperadora = new Map<string, number>();
    for (const a of antenas) {
      const g = geracoesDe(a.tecnologias);
      if (g.includes('4G')) com4G++;
      if (g.includes('5G')) com5G++;
      porOperadora.set(a.operadora, (porOperadora.get(a.operadora) ?? 0) + 1);
    }
    return {
      total: antenas.length,
      com4G,
      com5G,
      operadoras: [...porOperadora.entries()].sort((a, b) => b[1] - a[1]),
    };
  }, [antenas]);

  const cards = [
    { titulo: 'Antenas (ERBs)', valor: String(stats.total), detalhe: 'estações de celular', cor: '#334155' },
    { titulo: 'Com 5G', valor: String(stats.com5G), detalhe: 'cobertura 5G', cor: '#0ea5e9' },
    { titulo: 'Com 4G', valor: String(stats.com4G), detalhe: 'cobertura 4G', cor: '#16a34a' },
    { titulo: 'Operadoras', valor: String(stats.operadoras.length), detalhe: 'na seleção', cor: '#7c3aed' },
  ];

  return (
    <div className="resumo-wrap">
      <div className="resumo">
        {cards.map((c) => (
          <div className="card" key={c.titulo} style={{ borderTopColor: c.cor }}>
            <span className="card-titulo">{c.titulo}</span>
            <strong className="card-valor" style={{ color: c.cor }}>
              {c.valor}
            </strong>
            <span className="card-detalhe">{c.detalhe}</span>
          </div>
        ))}
      </div>

      <div className="legenda-operadoras">
        {stats.operadoras.map(([op, qtd]) => (
          <span className="legenda-item" key={op}>
            <span className="legenda-cor" style={{ background: corDaOperadora(op) }} />
            {op} <b>{qtd}</b>
          </span>
        ))}
      </div>
    </div>
  );
}
