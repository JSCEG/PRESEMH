import { useState } from 'react';
import { Indicator } from '@/services/indicators';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import RuleBuilder from './RuleBuilder';
import { EvaluationColumn } from '@/types/indicators';

interface IndicatorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Indicator>) => Promise<void>;
  initialData?: Indicator | null;
}

export default function IndicatorForm({ isOpen, onClose, onSubmit, initialData }: IndicatorFormProps) {
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState(initialData?.name || '');
  const [code, setCode] = useState(initialData?.code || '');
  const [dimension, setDimension] = useState(initialData?.dimension || 'Ambiental');
  const [weight, setWeight] = useState(initialData?.weight?.toString() || '1.0');

  // Estado de Reglas (Array de EvaluationColumn)
  const [rules, setRules] = useState<EvaluationColumn[]>(
    (initialData?.evaluation_rules as unknown as EvaluationColumn[]) || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        name,
        code,
        dimension,
        weight: parseFloat(weight),
        evaluation_rules: rules as any // Cast para compatibilidad con servicio
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error al guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Indicador' : 'Nuevo Indicador'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium">Código (Único)</label>
              <input
                required
                className="w-full p-2 border rounded-md"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={!!initialData}
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
            <div className="space-y-2 md:col-span-2">
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
          </div>

          <div className="space-y-2">
            <RuleBuilder initialRules={rules} onChange={setRules} />
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
