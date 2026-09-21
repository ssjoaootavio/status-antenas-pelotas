import { useEffect, useState } from 'react';
import { carregarNovidades } from '../api/dados';
import type { Novidade } from '../types';

export function useNovidades(): Novidade[] {
  const [eventos, setEventos] = useState<Novidade[]>([]);

  useEffect(() => {
    let ativo = true;
    carregarNovidades().then((n) => {
      if (ativo) setEventos(n.eventos ?? []);
    });
    return () => {
      ativo = false;
    };
  }, []);

  return eventos;
}
