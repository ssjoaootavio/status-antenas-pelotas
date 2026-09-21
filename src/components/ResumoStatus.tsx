import type { Resumo } from '../types';
import { CORES_STATUS } from '../utils';

interface Props {
  resumo: Resumo;
}

export function ResumoStatus({ resumo }: Props) {
  const cards = [
    {
      titulo: 'Antenas no ar',
      valor: `${resumo.percentualNoAr}%`,
      detalhe: `${resumo.online} de ${resumo.total}`,
      cor: CORES_STATUS.online,
    },
    {
      titulo: 'Instáveis',
      valor: String(resumo.instavel),
      detalhe: 'sinal degradado',
      cor: CORES_STATUS.instavel,
    },
    {
      titulo: 'Fora do ar',
      valor: String(resumo.offline),
      detalhe: 'sem sinal',
      cor: CORES_STATUS.offline,
    },
    {
      titulo: 'Bairros afetados',
      valor: String(resumo.bairrosAfetados),
      detalhe: 'com antenas em falha',
      cor: '#334155',
    },
  ];

  return (
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
  );
}
