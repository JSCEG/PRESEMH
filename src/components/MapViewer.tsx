import { useRef, useState, useCallback } from 'react';
import Map, { NavigationControl, ScaleControl, FullscreenControl, Source, Layer, MapLayerMouseEvent, MapRef, ViewStateChangeEvent, FillLayer, LineLayer } from 'react-map-gl/maplibre';
import type { MapSourceDataEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import InfoPanel from './InfoPanel';
import mockData from '@/data/mockIndicators.json';
import { SelectedFeature } from '@/types';

const GEOJSON_ESTADOS = "https://cdn.sassoapps.com/Indicadores_Eficiencia/estados.geojson";
const GEOJSON_MUNICIPIOS = "https://cdn.sassoapps.com/Indicadores_Eficiencia/municipios.geojson";
const MAP_STYLE = "https://demotiles.maplibre.org/style.json";

export default function MapViewer() {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: -102.5528,
    latitude: 23.6345,
    zoom: 4.5
  });

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);

  // --- Lógica Choropleth ---
  const municipalitiesFillStyle: FillLayer = {
    id: 'municipalities-fill',
    type: 'fill',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['feature-state', 'score'],
        0, '#9B2247',
        50, '#A57F2C',
        100, '#1E5B4F'
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.8,
        0.6
      ]
    }
  };

  const municipalitiesOutlineStyle: LineLayer = {
    id: 'municipalities-outline',
    type: 'line',
    paint: {
      'line-color': '#ffffff',
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        2,
        0.3
      ],
      'line-opacity': 0.8
    }
  };

  const statesLayerStyle: LineLayer = {
    id: 'states-outline',
    type: 'line',
    paint: {
      'line-color': '#9B2247',
      'line-width': 1.5,
      'line-opacity': 0.8
    }
  };

  const onSourceData = useCallback((e: MapSourceDataEvent) => {
    if (e.sourceId === 'municipios-data' && e.isSourceLoaded) {
      const map = mapRef.current?.getMap();
      if (!map) return;

      // Usar los datos del mock para asignar scores reales
      mockData.forEach(item => {
        map.setFeatureState(
          { source: 'municipios-data', id: item.id },
          { score: item.score }
        );
      });
    }
  }, []);

  const onHover = useCallback((event: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    if (hoveredId !== null) {
      map.setFeatureState({ source: 'municipios-data', id: hoveredId }, { hover: false });
    }
    const feature = event.features && event.features[0];
    if (feature && feature.id) {
      const newHoveredId = feature.id as string;
      setHoveredId(newHoveredId);
      map.setFeatureState({ source: 'municipios-data', id: newHoveredId }, { hover: true });
    } else {
      setHoveredId(null);
    }
  }, [hoveredId]);

  const onClick = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features && event.features[0];
    if (feature) {
      // Cast the feature to SelectedFeature
      setSelectedFeature(feature as unknown as SelectedFeature);
      const zoom = mapRef.current?.getZoom() || 4.5;
      mapRef.current?.flyTo({
        center: [event.lngLat.lng, event.lngLat.lat],
        zoom: zoom < 7 ? 8 : zoom,
        duration: 1000
      });
    } else {
      setSelectedFeature(null);
    }
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        interactiveLayerIds={['municipalities-fill']}
        onMouseMove={onHover}
        onClick={onClick}
        onSourceData={onSourceData}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <ScaleControl position="bottom-left" unit="metric" />

        <Source id="municipios-data" type="geojson" data={GEOJSON_MUNICIPIOS} promoteId="CVEGEO">
          <Layer {...municipalitiesFillStyle} />
          <Layer {...municipalitiesOutlineStyle} />
        </Source>

        <Source id="estados-data" type="geojson" data={GEOJSON_ESTADOS}>
          <Layer {...statesLayerStyle} />
        </Source>
      </Map>

      {/* Panel de Información (Bottom Sheet / Sidebar) */}
      <InfoPanel 
        selectedFeature={selectedFeature} 
        onClose={() => setSelectedFeature(null)} 
      />

      {/* Leyenda */}
      <div className="absolute bottom-10 left-4 bg-white/90 p-3 rounded-lg shadow-lg border border-slate-200 z-10 hidden md:block">
        <h4 className="text-xs font-bold text-slate-700 mb-2 font-headings uppercase">Eficiencia Energética</h4>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2 text-[10px]">
            <div className="w-4 h-4 bg-[#1E5B4F] rounded"></div>
            <span>Alta (80-100)</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px]">
            <div className="w-4 h-4 bg-[#A57F2C] rounded"></div>
            <span>Media (40-79)</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px]">
            <div className="w-4 h-4 bg-[#9B2247] rounded"></div>
            <span>Baja (0-39)</span>
          </div>
        </div>
      </div>
    </div>
  );
}