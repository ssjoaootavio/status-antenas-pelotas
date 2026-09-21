import { useEffect, useState } from 'react';
import { carregarDados } from '../api/dados';
import type { DadosPelotas } from '../types';

interface Estado {
  dados: DadosPelotas | null;
  carregando: boolean;
  erro: string | null;
}

export function useDados(): Estado {
  const [dados, setDados] = useState<DadosPelotas | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    carregarDados()
      .then((d) => {
        if (ativo) setDados(d);
      })
      .catch((e: unknown) => {
        if (ativo) setErro(e instanceof Error ? e.message : 'Falha ao carregar');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  return { dados, carregando, erro };
}
