import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Antena } from '../types';
import { CORES_STATUS, LABEL_STATUS, formatarHora } from '../utils';

const PELOTAS: [number, number] = [-31.7719, -52.3425];

interface Props {
  antenas: Antena[];
  selecionada: string | null;
  onSelecionar: (id: string) => void;
}

export function MapaAntenas({ antenas, selecionada, onSelecionar }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const camadaRef = useRef<L.LayerGroup | null>(null);
  const marcadoresRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const onSelecionarRef = useRef(onSelecionar);
  onSelecionarRef.current = onSelecionar;

  // Inicializa o mapa uma vez.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: PELOTAS,
      zoom: 12,
      zoomControl: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);
    camadaRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      camadaRef.current = null;
      marcadoresRef.current.clear();
    };
  }, []);

  // Redesenha os marcadores quando as antenas mudam.
  useEffect(() => {
    const camada = camadaRef.current;
    if (!camada) return;
    camada.clearLayers();
    marcadoresRef.current.clear();

    for (const a of antenas) {
      const marcador = L.circleMarker([a.lat, a.lng], {
        radius: a.status === 'offline' ? 9 : 7,
        color: '#ffffff',
        weight: 1.5,
        fillColor: CORES_STATUS[a.status],
        fillOpacity: 0.9,
      });
      marcador.bindPopup(
        `<strong>${a.bairro}</strong> — ${a.operadora}<br/>` +
          `${a.id} · ${a.tecnologia}<br/>` +
          `<span style="color:${CORES_STATUS[a.status]};font-weight:600">${LABEL_STATUS[a.status]}</span><br/>` +
          `<small>Atualizado ${formatarHora(a.atualizadoEm)}</small>`,
      );
      marcador.on('click', () => onSelecionarRef.current(a.id));
      marcador.addTo(camada);
      marcadoresRef.current.set(a.id, marcador);
    }
  }, [antenas]);

  // Abre o popup da antena selecionada (via lista).
  useEffect(() => {
    if (!selecionada) return;
    const marcador = marcadoresRef.current.get(selecionada);
    const map = mapRef.current;
    if (marcador && map) {
      map.panTo(marcador.getLatLng());
      marcador.openPopup();
    }
  }, [selecionada]);

  return <div ref={containerRef} className="mapa" />;
}
