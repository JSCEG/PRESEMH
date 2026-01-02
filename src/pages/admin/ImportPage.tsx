import DataImporter from '@/components/admin/DataImporter';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Database, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

export default function ImportPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const syncMunicipalities = async () => {
    setSyncing(true);
    setSyncStatus('Consultando API INEGI...');
    try {
      // Endpoint del INEGI (Ajustar URL si es necesario)
      const response = await fetch('https://gaia.inegi.org.mx/wscatgeo/mgee/');
      if (!response.ok) throw new Error('Error al conectar con INEGI');
      
      const json = await response.json();
      const arr = json.datos || []; // Ajustar según estructura real del JSON de INEGI

      // Metadatos generales
      const fuente = String(json?.metadatos?.Fuente_informacion_estadistica ?? "INEGI").trim();
      const anio = 2020;

      const municipalities = arr.map((m: any) => ({
        cvegeo: String(m?.cvegeo ?? "").trim(),
        name: String(m?.nom_mun ?? m?.nomgeo ?? "").trim(), // Ajuste común en APIs INEGI
        state: String(m?.cve_ent ?? "").trim(), // Usamos cve_ent como state code
        region: null,

        // Campos extendidos
        cve_ent: String(m?.cve_ent ?? "").trim(),
        cve_mun: String(m?.cve_mun ?? "").trim(),
        cve_cab: String(m?.cve_cab ?? "").trim(),
        nom_cab: String(m?.nom_cab ?? "").trim(),

        pob_total: m?.pob_total ? Number(m.pob_total) : null,
        pob_femenina: m?.pob_femenina ? Number(m.pob_femenina) : null,
        pob_masculina: m?.pob_masculina ? Number(m.pob_masculina) : null,
        total_viviendas_habitadas: m?.total_viviendas_habitadas ? Number(m.total_viviendas_habitadas) : null,

        fuente,
        anio,
      })).filter((r: any) => r.cvegeo.length === 5 && r.name.length > 0);

      setSyncStatus(`Procesando ${municipalities.length} municipios...`);
      
      // Upsert en bloques de 100 para no saturar Supabase
      const batchSize = 100;
      let insertedCount = 0;
      
      for (let i = 0; i < municipalities.length; i += batchSize) {
        const batch = municipalities.slice(i, i + batchSize);
        const { error } = await supabase.from('municipalities').upsert(batch);
        
        if (error) {
          console.error('Error en lote:', error);
          throw error;
        }
        insertedCount += batch.length;
        setSyncStatus(`Insertados: ${insertedCount} / ${municipalities.length}`);
      }

      setSyncStatus(`¡Éxito! ${insertedCount} municipios actualizados.`);
    } catch (error: any) {
      console.error(error);
      setSyncStatus(`Error: ${error.message}`);
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
              Catálogo de Municipios (INEGI)
            </h3>
            <p className="text-xs text-slate-500">Sincroniza datos censales 2020 directamente del servicio web.</p>
          </div>
          <div className="flex items-center space-x-4">
            {syncStatus && (
              <span className={`text-xs font-medium flex items-center ${syncStatus.includes('Error') ? 'text-red-600' : 'text-gobmx-verde'}`}>
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
              <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              Sincronizar
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