import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { RangeRule } from '@/types/indicators';

interface NumericRangesEditorProps {
  initialRanges: RangeRule[];
  onChange: (ranges: RangeRule[]) => void;
}

export default function NumericRangesEditor({ initialRanges, onChange }: NumericRangesEditorProps) {
  const [ranges, setRanges] = useState<RangeRule[]>(initialRanges || []);

  useEffect(() => {
    setRanges(initialRanges || []);
  }, [initialRanges]);

  useEffect(() => {
    onChange(ranges);
  }, [ranges]);

  const addRange = () => {
    setRanges([...ranges, { score: 1, label: '', op: '>', value: 0 }]);
  };

  const removeRange = (index: number) => {
    const newRanges = ranges.filter((_, i) => i !== index);
    setRanges(newRanges);
  };

  const updateRange = (index: number, field: keyof RangeRule, value: any) => {
    const newRanges = [...ranges];
    newRanges[index] = { ...newRanges[index], [field]: value };
    setRanges(newRanges);
  };

  return (
    <div className="space-y-2">
      {ranges.map((range, index) => (
        <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded border">
          {/* Operador */}
          <select
            className="w-20 p-1 border rounded text-xs"
            value={range.op}
            onChange={(e) => updateRange(index, 'op', e.target.value)}
          >
            <option value=">">&gt;</option>
            <option value=">=">&ge;</option>
            <option value="<">&lt;</option>
            <option value="<=">&le;</option>
            <option value="=">=</option>
            <option value="between">Entre</option>
          </select>

          {/* Valor */}
          <input
            type="number"
            step="0.01"
            className="w-24 p-1 border rounded text-xs"
            value={range.value}
            onChange={(e) => updateRange(index, 'value', Number(e.target.value))}
            placeholder="Min/Valor"
          />

          {range.op === 'between' && (
            <>
              <span className="text-xs text-slate-400">y</span>
              <input
                type="number"
                step="0.01"
                className="w-24 p-1 border rounded text-xs"
                value={range.max || 0}
                onChange={(e) => updateRange(index, 'max', Number(e.target.value))}
                placeholder="Max"
              />
            </>
          )}

          <span className="text-xs text-slate-400">&rarr;</span>

          {/* Puntaje */}
          <select
            className="w-24 p-1 border rounded text-xs font-bold text-gobmx-guinda"
            value={range.score}
            onChange={(e) => updateRange(index, 'score', Number(e.target.value))}
          >
            <option value={1}>1 (Exc)</option>
            <option value={2}>2 (Sob)</option>
            <option value={3}>3 (Ade)</option>
            <option value={4}>4 (Def)</option>
            <option value={5}>5 (Cri)</option>
          </select>

          {/* Etiqueta */}
          <input
            className="flex-1 p-1 border rounded text-xs"
            value={range.label}
            onChange={(e) => updateRange(index, 'label', e.target.value)}
            placeholder="Etiqueta (Opcional)"
          />

          <Button type="button" variant="ghost" size="icon" onClick={() => removeRange(index)} className="h-6 w-6 text-red-500">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={addRange} className="w-full text-xs h-7">
        <Plus className="h-3 w-3 mr-1" /> Agregar Rango Numérico
      </Button>
    </div>
  );
}
