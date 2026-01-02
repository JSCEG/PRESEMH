import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // O select nativo si falla
import { Upload, FileSpreadsheet, ArrowRight, Save, Loader2, CheckCircle } from 'lucide-react';
import { indicatorsService, Indicator } from '@/services/indicators';

// Tipos
interface ExcelSheet {
  name: string;
  data: any[];
  headers: string[];
}

export default function DataImporter() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  
  // Datos procesados
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  // Selección de Indicador
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>('');

  // Mapeo: key del indicador -> columna del excel
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const data = await uploadedFile.arrayBuffer();
    const wb = XLSX.read(data);
    setWorkbook(wb);
    setSheets(wb.SheetNames);
    setStep(2);

    // Cargar indicadores disponibles para el paso 3
    const inds = await indicatorsService.getAll();
    setIndicators(inds);
  };

  const handleSheetSelect = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (!workbook) return;
    
    const ws = workbook.Sheets[sheetName];
    // Leer con encabezados en la fila correcta (asumimos fila 2 o buscamos "ID")
    // Estrategia simple: leer todo y buscar la fila que tenga "ID" o "Municipio"
    const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
    
    // Buscar fila de encabezados
    let headerRowIndex = 0;
    const foundIndex = json.findIndex((row: any) => row.includes('ID') || row.includes('Municipio'));
    if (foundIndex !== -1) headerRowIndex = foundIndex;

    const realHeaders = json[headerRowIndex] as string[];
    const realData = json.slice(headerRowIndex + 1);

    setHeaders(realHeaders);
    setPreviewData(realData.slice(0, 5)); // Solo 5 para preview
    setStep(3);
  };

  return (
    <div className="space-y-6">
      {/* Paso 1: Subir Archivo */}
      {step === 1 && (
        <Card className="border-dashed border-2 hover:bg-slate-50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">Subir Archivo Excel</h3>
            <p className="text-sm text-slate-500 mb-6">Arrastra tu archivo o haz clic para seleccionar</p>
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              className="hidden" 
              id="file-upload"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>Seleccionar Archivo</span>
              </Button>
            </label>
          </CardContent>
        </Card>
      )}

      {/* Paso 2: Seleccionar Hoja */}
      {step === 2 && (
        <Card>
          <CardHeader><CardTitle>Selecciona la Hoja de Datos</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sheets.map(sheet => (
                <Button 
                  key={sheet} 
                  variant="outline" 
                  className="justify-start h-auto py-3 px-4"
                  onClick={() => handleSheetSelect(sheet)}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                  <span className="truncate">{sheet}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 3: Mapeo (Placeholder) */}
      {step === 3 && (
        <Card>
          <CardHeader><CardTitle>Configurar Importación</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">Hoja seleccionada: <strong>{selectedSheet}</strong></p>
            
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Selecciona el Indicador Destino:</label>
              <select 
                className="w-full p-2 border rounded"
                onChange={(e) => setSelectedIndicatorId(e.target.value)}
              >
                <option value="">-- Seleccionar --</option>
                {indicators.map(ind => (
                  <option key={ind.id} value={ind.id}>{ind.name} ({ind.code})</option>
                ))}
              </select>
            </div>

            {selectedIndicatorId && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                Aquí irán los selectores para mapear las columnas del Excel a las variables del Indicador.
                <br/>
                (Próxima implementación)
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStep(1)} variant="ghost" className="mr-2">Cancelar</Button>
              <Button disabled={!selectedIndicatorId}>
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
