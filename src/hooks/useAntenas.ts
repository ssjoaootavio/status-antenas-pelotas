import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchAntenas } from '../api/antenas';
import type { Antena } from '../types';

interface EstadoAntenas {
  antenas: Antena[];
  carregando: boolean;
  erro: string | null;
  ultimaAtualizacao: Date | null;
  recarregar: () => void;
}

/**
 * Busca as antenas e reexecuta a cada `intervaloMs` (0 = sem auto-refresh).
 */
export function useAntenas(intervaloMs = 15000): EstadoAntenas {
  const [antenas, setAntenas] = useState<Antena[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null);
  const montado = useRef(true);

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      const dados = await fetchAntenas();
      if (!montado.current) return;
      setAntenas(dados);
      setUltimaAtualizacao(new Date());
    } catch (e) {
      if (!montado.current) return;
      setErro(e instanceof Error ? e.message : 'Falha ao carregar dados');
    } finally {
      if (montado.current) setCarregando(false);
    }
  }, []);

  useEffect(() => {
    montado.current = true;
    carregar();
    if (intervaloMs > 0) {
      const id = setInterval(carregar, intervaloMs);
      return () => {
        montado.current = false;
        clearInterval(id);
      };
    }
    return () => {
      montado.current = false;
    };
  }, [carregar, intervaloMs]);

  return { antenas, carregando, erro, ultimaAtualizacao, recarregar: carregar };
}
