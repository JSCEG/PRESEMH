import { useEffect, useState } from 'react';
import { indicatorsService, Indicator } from '@/services/indicators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Loader2, FileJson } from 'lucide-react';
import IndicatorForm from '@/components/admin/IndicatorForm';

export default function IndicatorsManagement() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);

  const fetchIndicators = async () => {
    setLoading(true);
    try {
      const data = await indicatorsService.getAll();
      setIndicators(data);
    } catch (error) {
      console.error('Error al cargar indicadores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndicators();
  }, []);

  const handleCreate = () => {
    setEditingIndicator(null);
    setIsModalOpen(true);
  };

  const handleEdit = (indicator: Indicator) => {
    setEditingIndicator(indicator);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este indicador? Esta acción no se puede deshacer.')) {
      await indicatorsService.delete(id);
      fetchIndicators();
    }
  };

  const handleSubmit = async (data: Partial<Indicator>) => {
    // Si estamos editando...
    if (editingIndicator) {
      await indicatorsService.update(editingIndicator.id, data);
    } else {
      // Si es nuevo (necesitamos crear el método create en el servicio, o usar update/insert)
      // Por ahora, asumiremos que update maneja el upsert o implementaremos create después.
      // (Nota: El servicio indicators.ts actual solo tiene update y delete, falta create. Lo añadiré en el siguiente paso).
      console.warn("Creación no implementada en el servicio aún.");
    }
    fetchIndicators();
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gobmx-guinda h-8 w-8" /></div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gobmx-guinda font-headings">Gestión de Indicadores</h1>
          <Button onClick={handleCreate} className="bg-gobmx-verde hover:bg-[#164a40] text-white">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Indicador
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Catálogo Maestro ({indicators.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-600 uppercase font-bold">
                  <tr>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Dimensión</th>
                    <th className="px-4 py-3">Peso</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {indicators.map((indicator) => (
                    <tr key={indicator.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{indicator.code}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{indicator.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          indicator.dimension === 'Ambiental' ? 'bg-green-100 text-green-700' :
                          indicator.dimension === 'Social' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {indicator.dimension}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold">{indicator.weight}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <Button size="sm" variant="outline" title="Editar Reglas JSON" onClick={() => handleEdit(indicator)}>
                          <FileJson className="h-4 w-4 text-slate-500" />
                        </Button>
                        <Button size="sm" variant="outline" title="Editar General" onClick={() => handleEdit(indicator)}>
                          <Edit className="h-4 w-4 text-slate-700" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(indicator.id)} title="Eliminar">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal de Edición */}
        {isModalOpen && (
          <IndicatorForm 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={editingIndicator}
          />
        )}
      </div>
    </div>
  );
}
