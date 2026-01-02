import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export interface Rule {
  operator: '>' | '>=' | '<' | '<=' | '=';
  value: number;
  score: number;
  label: string;
}

interface RulesEditorProps {
  initialRules: any[];
  onChange: (rules: any[]) => void;
}

export default function RulesEditor({ initialRules, onChange }: RulesEditorProps) {
  const parseRules = (rules: any) => {
    if (Array.isArray(rules)) return rules;
    if (rules && typeof rules === 'object' && rules.ranges) return rules.ranges;
    return [];
  };

  const [rules, setRules] = useState<Rule[]>(parseRules(initialRules));

  useEffect(() => {
    onChange(rules);
  }, [rules]);

  const addRule = () => {
    setRules([...rules, { operator: '>', value: 0, score: 1, label: 'Nuevo Rango' }]);
  };

  const removeRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
  };

  const updateRule = (index: number, field: keyof Rule, value: any) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value } as Rule;
    setRules(newRules);
  };

  return (
    <div className="space-y-2 border rounded-md p-4 bg-slate-50">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-bold text-slate-700">Rangos de Evaluación</h4>
        <Button type="button" size="sm" variant="outline" onClick={addRule}>
          <Plus className="h-3 w-3 mr-1" /> Agregar Rango
        </Button>
      </div>

      <div className="space-y-2">
        {rules.map((rule, index) => (
          <div key={index} className="flex items-center space-x-2 bg-white p-2 rounded border shadow-sm">
            <div className="w-24 space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">OPERADOR</label>
              <select
                className="w-full p-1 border rounded text-xs"
                value={rule.operator}
                onChange={(e) => updateRule(index, 'operator', e.target.value)}
              >
                <option value=">">&gt; (Mayor que)</option>
                <option value=">=">&gt;= (Mayor o igual)</option>
                <option value="<">&lt; (Menor que)</option>
                <option value="<=">&lt;= (Menor o igual)</option>
                <option value="=">= (Igual a)</option>
              </select>
            </div>
            
            <div className="flex-1 space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">VALOR</label>
              <input
                type="number"
                step="0.001"
                className="w-full p-1 border rounded text-xs"
                value={rule.value}
                onChange={(e) => updateRule(index, 'value', Number(e.target.value))}
              />
            </div>

            <div className="w-24 space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">PUNTOS</label>
              <select
                className="w-full p-1 border rounded text-xs font-bold text-gobmx-guinda"
                value={rule.score}
                onChange={(e) => updateRule(index, 'score', Number(e.target.value))}
              >
                <option value={1}>1 (Exc)</option>
                <option value={2}>2 (Sob)</option>
                <option value={3}>3 (Ade)</option>
                <option value={4}>4 (Def)</option>
                <option value={5}>5 (Cri)</option>
              </select>
            </div>

            <div className="flex-[2] space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">ETIQUETA</label>
              <input
                type="text"
                className="w-full p-1 border rounded text-xs"
                value={rule.label}
                onChange={(e) => updateRule(index, 'label', e.target.value)}
                placeholder="Ej: CRÍTICO"
              />
            </div>

            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => removeRule(index)} 
              className="mt-4 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <p className="text-[10px] text-slate-400 mt-2 italic">
        * Las reglas se evalúan en orden. La primera que coincida asignará el puntaje.
      </p>
    </div>
  );
}