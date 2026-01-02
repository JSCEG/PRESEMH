import { useState } from 'react';
import { Indicator } from '@/services/indicators';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

// Si no tienes los componentes de UI básicos instalados, usaré HTML estándar estilizado para agilizar
// y evitar errores de importación de componentes no creados.

interface IndicatorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Indicator>) => Promise<void>;
  initialData?: Indicator | null;
}

export default function IndicatorForm({ isOpen, onClose, onSubmit, initialData }: IndicatorFormProps) {
  const [loading, setLoading] = useState(false);
  
  // Estado del formulario
  const [name, setName] = useState(initialData?.name || '');
  const [code, setCode] = useState(initialData?.code || '');
  const [dimension, setDimension] = useState(initialData?.dimension || 'Ambiental');
  const [weight, setWeight] = useState(initialData?.weight?.toString() || '1.0');

  // Estado de Reglas (Simplificado para MVP)
  // En una versión completa esto sería un array dinámico de rangos
  const [rulesJson, setRulesJson] = useState(JSON.stringify(initialData?.evaluation_rules || [], null, 2));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        name,
        code,
        dimension,
        weight: parseFloat(weight),
        evaluation_rules: JSON.parse(rulesJson) // Validar que sea JSON válido
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error al guardar. Revisa que el JSON de reglas sea válido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Indicador' : 'Nuevo Indicador'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Código (Único)</label>
              <input
                required
                className="w-full p-2 border rounded-md"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={!!initialData} // No editar código de existentes para integridad
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dimensión</label>
              <select
                className="w-full p-2 border rounded-md"
                value={dimension}
                onChange={(e) => setDimension(e.target.value)}
              >
                <option value="Ambiental">Ambiental</option>
                <option value="Social">Social</option>
                <option value="Económico">Económico</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre</label>
            <input
              required
              className="w-full p-2 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Peso Global</label>
            <input
              type="number"
              step="0.1"
              required
              className="w-full p-2 border rounded-md"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reglas de Evaluación (JSON)</label>
            <p className="text-xs text-slate-500">
              Define los rangos para asignar puntajes (1-5).
            </p>
            <textarea
              className="w-full p-2 border rounded-md font-mono text-xs h-40 bg-slate-50"
              value={rulesJson}
              onChange={(e) => setRulesJson(e.target.value)}
              placeholder='[{"min": 0, "max": 10, "score": 1}]'
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-gobmx-guinda text-white">
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
