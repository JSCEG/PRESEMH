import DataImporter from '@/components/admin/DataImporter';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Database, CheckCircle, Loader2 } from 'lucide-react';

export default function ImportPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const syncMunicipalities = async () => {
    setSyncing(true);
    setSyncStatus('Descargando GeoJSON...');
    try {
      const response = await fetch('https://cdn.sassoapps.com/Indicadores_Eficiencia/municipios.geojson');
      const geojson = await response.json();
      
      const municipalities = geojson.features.map((f: any) => ({
        cvegeo: f.properties.CVEGEO,
        name: f.properties.NOMGEO,
        state: f.properties.CVE_ENT // O mapear a nombre de estado si está disponible
      }));

      setSyncStatus(`Insertando ${municipalities.length} municipios...`);
      
      // Upsert en bloques
      const batchSize = 200;
      for (let i = 0; i < municipalities.length; i += batchSize) {
        const batch = municipalities.slice(i, i + batchSize);
        const { error } = await supabase.from('municipalities').upsert(batch);
        if (error) throw error;
      }

      setSyncStatus('¡Catálogo sincronizado con éxito!');
    } catch (error) {
      console.error(error);
      setSyncStatus('Error al sincronizar catálogo.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gobmx-guinda mb-2 font-headings">Panel de Datos</h1>
          <p className="text-slate-500">Gestión de catálogos e importación masiva.</p>
        </div>

        {/* Herramientas de Catálogo */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-700 flex items-center">
              <Database className="h-4 w-4 mr-2 text-gobmx-dorado" />
              Catálogo de Municipios
            </h3>
            <p className="text-xs text-slate-500">Sincroniza la lista oficial desde el GeoJSON de Cloudflare.</p>
          </div>
          <div className="flex items-center space-x-4">
            {syncStatus && (
              <span className="text-xs font-medium text-gobmx-verde flex items-center">
                {syncing ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                {syncStatus}
              </span>
            )}
            <Button 
              onClick={syncMunicipalities} 
              disabled={syncing}
              variant="outline"
              className="border-gobmx-dorado text-gobmx-dorado hover:bg-gobmx-dorado-light"
            >
              Sincronizar Ahora
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-700">Importador de Mediciones</h2>
          <DataImporter />
        </div>
      </div>
    </div>
  );
}
