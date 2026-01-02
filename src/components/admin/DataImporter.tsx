import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { indicatorsService, Indicator } from '@/services/indicators';

export default function DataImporter() {
  const [step, setStep] = useState(1);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  
  // Selección de Indicador
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    // Leer archivo
    const data = await uploadedFile.arrayBuffer();
    const wb = XLSX.read(data);
    setWorkbook(wb);
    setSheets(wb.SheetNames);
    setStep(2);

    // Cargar indicadores
    const inds = await indicatorsService.getAll();
    setIndicators(inds);
  };

  const handleSheetSelect = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (!workbook) return;
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

      {/* Paso 3: Configuración Básica */}
      {step === 3 && (
        <Card>
          <CardHeader><CardTitle>Configurar Importación</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-slate-600">Hoja seleccionada: <strong>{selectedSheet}</strong></p>
            
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Selecciona el Indicador Destino:</label>
              <select 
                className="w-full p-2 border rounded-md bg-white text-sm"
                value={selectedIndicatorId}
                onChange={(e) => setSelectedIndicatorId(e.target.value)}
              >
                <option value="">-- Seleccionar --</option>
                {indicators.map(ind => (
                  <option key={ind.id} value={ind.id}>{ind.name} ({ind.code})</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              <p className="font-bold">Próximamente:</p>
              <p>El sistema detectará automáticamente las columnas necesarias para este indicador basándose en las reglas configuradas.</p>
            </div>
            
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