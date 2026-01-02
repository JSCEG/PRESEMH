import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet, ArrowRight, Save, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { indicatorsService, Indicator } from '@/services/indicators';
import { supabase } from '@/lib/supabase';
import { evaluateValue } from '@/lib/evaluator';

export default function DataImporter() {
  const [step, setStep] = useState(1);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  
  // Datos procesados del Excel
  const [headers, setHeaders] = useState<string[]>([]);
  const [excelRows, setExcelRows] = useState<any[]>([]);

  // Selección de Indicador y Mapeo
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [idColumn, setIdColumn] = useState<string>(''); // Columna que contiene el CVEGEO
  const [columnMapping, setMapping] = useState<Record<string, string>>({}); // rule_id -> excel_header

  // Estado de carga
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const data = await uploadedFile.arrayBuffer();
    const wb = XLSX.read(data);
    setWorkbook(wb);
    setSheets(wb.SheetNames);
    setStep(2);

    const inds = await indicatorsService.getAll();
    setIndicators(inds);
  };

  const handleSheetSelect = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (!workbook) return;
    
    const ws = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
    
    // Buscar fila de encabezados inteligentemente
    let headerRowIndex = json.findIndex((row: any) => 
      Array.isArray(row) && (row.includes('ID') || row.includes('Municipio') || row.includes('Cvegeo'))
    );
    if (headerRowIndex === -1) headerRowIndex = 0;

    const rawHeaders = json[headerRowIndex] as string[];
    // Limpiar headers vacíos o nulos
    const cleanHeaders = rawHeaders.map((h, i) => h ? String(h).trim() : `Columna ${i+1}`);
    
    const rawData = json.slice(headerRowIndex + 1);
    
    // Convertir a array de objetos usando los headers
    const objects = rawData.map((row: any) => {
      const obj: any = {};
      cleanHeaders.forEach((h, i) => {
        obj[h] = row[i];
      });
      return obj;
    });

    setHeaders(cleanHeaders);
    setExcelRows(objects);
    setStep(3);
  };

  const handleIndicatorSelect = (id: string) => {
    const ind = indicators.find(i => i.id === id) || null;
    setSelectedIndicator(ind);
    
    // Pre-llenar mapeo si coinciden nombres exactos
    if (ind) {
      const initialMap: Record<string, string> = {};
      ind.evaluation_rules.forEach(rule => {
        const match = headers.find(h => h.toLowerCase() === rule.excel_column_key.toLowerCase());
        if (match) initialMap[rule.id] = match;
      });
      setMapping(initialMap);
    }
  };

  const executeImport = async () => {
    if (!selectedIndicator || !idColumn) return;
    
    setLoading(true);
    setStatus('importing');
    setProgress(0);

    try {
      const measurements = excelRows.map((row, index) => {
        // 1. Obtener ID del municipio (CVEGEO) y normalizar a 5 dígitos
        let cvegeo = String(row[idColumn]).trim();
        if (cvegeo.length < 5 && !isNaN(Number(cvegeo))) cvegeo = cvegeo.padStart(5, '0');

        // 2. Extraer datos crudos para el JSONB
        const rawData: Record<string, any> = {};
        let totalIndicatorScore = 0;
        const scoreDetail: Record<string, number> = {};

        selectedIndicator.evaluation_rules.forEach(rule => {
          const excelHeader = columnMapping[rule.id];
          const val = row[excelHeader];
          rawData[rule.excel_column_key] = val;
          
          // Calcular puntaje usando el evaluador
          const points = evaluateValue(rule, val);
          scoreDetail[rule.display_name] = points;
          totalIndicatorScore += points;
        });

        return {
          municipality_id: cvegeo,
          indicator_id: selectedIndicator.id,
          data: rawData,
          score_detail: scoreDetail,
          total_score: totalIndicatorScore,
          year: 2025 // TODO: Hacer dinámico
        };
      }).filter(m => m.municipality_id !== 'NaN' && m.municipality_id.length >= 2);

      // Insertar en bloques de 100 para no saturar
      const batchSize = 100;
      for (let i = 0; i < measurements.length; i += batchSize) {
        const batch = measurements.slice(i, i + batchSize);
        const { error } = await supabase.from('measurements').upsert(batch, {
          onConflict: 'municipality_id, indicator_id, year'
        });
        if (error) throw error;
        setProgress(Math.round(((i + batchSize) / measurements.length) * 100));
      }

      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Paso 1: Subir Archivo */}
      {step === 1 && (
        <Card className="border-dashed border-2 hover:bg-slate-50 transition-colors py-12">
          <CardContent className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-bold">Subir Excel</h3>
            <input type="file" accept=".xlsx, .xls" className="hidden" id="file-up" onChange={handleFileUpload} />
            <label htmlFor="file-up" className="mt-4"><Button variant="outline" asChild><span>Seleccionar Archivo</span></Button></label>
          </CardContent>
        </Card>
      )}

      {/* Paso 2: Hojas */}
      {step === 2 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sheets.map(s => (
            <Button key={s} variant="outline" className="h-20" onClick={() => handleSheetSelect(s)}>
              <FileSpreadsheet className="mr-2 h-4 w-4" /> {s}
            </Button>
          ))}
        </div>
      )}

      {/* Paso 3: Mapeo y Ejecución */}
      {step === 3 && (
        <Card>
          <CardHeader><CardTitle>Configuración de Importación</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Selección de Indicador */}
              <div className="space-y-2">
                <label className="text-sm font-bold">1. Indicador Destino:</label>
                <select 
                  className="w-full p-2 border rounded bg-white"
                  value={selectedIndicator?.id || ''}
                  onChange={(e) => handleIndicatorSelect(e.target.value)}
                >
                  <option value="">-- Seleccionar --</option>
                  {indicators.map(ind => <option key={ind.id} value={ind.id}>{ind.name}</option>)}
                </select>
              </div>

              {/* Selección de Columna ID */}
              <div className="space-y-2">
                <label className="text-sm font-bold">2. Columna de ID (CVEGEO):</label>
                <select 
                  className="w-full p-2 border rounded bg-white font-mono text-xs"
                  value={idColumn}
                  onChange={(e) => setIdColumn(e.target.value)}
                >
                  <option value="">-- Seleccionar columna --</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>

            {selectedIndicator && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-bold text-gobmx-guinda uppercase">3. Mapeo de Variables del Indicador</h4>
                <p className="text-xs text-slate-500 italic">Asocia cada variable configurada en el indicador con una columna del Excel.</p>
                <div className="grid grid-cols-1 gap-3">
                  {selectedIndicator.evaluation_rules.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-3 bg-slate-50 rounded border">
                      <span className="text-sm font-medium">{rule.display_name} ({rule.excel_column_key})</span>
                      <select 
                        className="w-1/2 p-1 border rounded bg-white text-xs font-mono"
                        value={columnMapping[rule.id] || ''}
                        onChange={(e) => setMapping({...columnMapping, [rule.id]: e.target.value})}
                      >
                        <option value="">-- No mapeado --</option>
                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acciones Finales */}
            <div className="border-t pt-6 flex flex-col items-center">
              {status === 'idle' && (
                <Button 
                  disabled={!selectedIndicator || !idColumn || Object.keys(columnMapping).length === 0}
                  onClick={executeImport}
                  className="bg-gobmx-guinda text-white w-full py-6"
                >
                  <Save className="mr-2 h-5 w-5" /> Importar {excelRows.length} Registros
                </Button>
              )}

              {status === 'importing' && (
                <div className="w-full text-center space-y-4">
                  <Loader2 className="animate-spin h-8 w-8 text-gobmx-guinda mx-auto" />
                  <p className="text-sm font-bold">Procesando y Guardando: {progress}%</p>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-gobmx-guinda h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {status === 'success' && (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="font-bold text-green-700">¡Importación completada con éxito!</p>
                  <Button onClick={() => setStep(1)} variant="outline">Subir otro archivo</Button>
                </div>
              )}

              {status === 'error' && (
                <div className="text-center space-y-4">
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
                  <p className="font-bold text-red-700">Ocurrió un error durante la importación.</p>
                  <Button onClick={() => setStatus('idle')} variant="outline">Reintentar</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
