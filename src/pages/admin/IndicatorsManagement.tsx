import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default function IndicatorsManagement() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gobmx-guinda font-headings">Gestión de Indicadores</h1>
          <Button className="bg-gobmx-verde hover:bg-[#164a40] text-white">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Indicador
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Catálogo Maestro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500">Aquí se listarán los indicadores cargados del Excel.</p>
            {/* Aquí implementaremos la tabla real en el siguiente paso */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
