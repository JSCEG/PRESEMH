import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface Rule {
  operator: string;
  value: string | number;
  score: number;
  label: string;
}

export interface EvaluationGroup {
  target: string; // Nombre de la columna en Excel
  output_name: string; // Nombre del puntaje resultante
  type: 'number' | 'text'; // Tipo de dato a evaluar
  ranges: Rule[];
}

interface RulesEditorProps {
  initialRules: any[];
  onChange: (rules: any[]) => void;
}

export default function RulesEditor({ initialRules, onChange }: RulesEditorProps) {
  // Normalizar entrada a array de grupos
  const parseRules = (rules: any): EvaluationGroup[] => {
    if (Array.isArray(rules) && rules.length > 0 && 'target' in rules[0]) {
      return rules;
    }
    // Migración de formato simple antiguo a nuevo formato de grupos
    if (Array.isArray(rules) && rules.length > 0 && 'operator' in rules[0]) {
      return [{
        target: 'valor_principal',
        output_name: 'Puntaje',
        type: 'number',
        ranges: rules
      }];
    }
    return [];
  };

  const [groups, setGroups] = useState<EvaluationGroup[]>(parseRules(initialRules));

  useEffect(() => {
    onChange(groups);
  }, [groups]);

  const addGroup = () => {
    setGroups([...groups, {
      target: '',
      output_name: 'Nuevo Puntaje',
      type: 'number',
      ranges: []
    }]);
  };

  const removeGroup = (index: number) => {
    const newGroups = groups.filter((_, i) => i !== index);
    setGroups(newGroups);
  };

  const updateGroup = (index: number, field: keyof EvaluationGroup, value: any) => {
    const newGroups = [...groups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    setGroups(newGroups);
  };

  const addRuleToGroup = (groupIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex].ranges.push({
      operator: newGroups[groupIndex].type === 'number' ? '>' : '=',
      value: '',
      score: 1,
      label: ''
    });
    setGroups(newGroups);
  };

  const removeRuleFromGroup = (groupIndex: number, ruleIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex].ranges = newGroups[groupIndex].ranges.filter((_, i) => i !== ruleIndex);
    setGroups(newGroups);
  };

  const updateRuleInGroup = (groupIndex: number, ruleIndex: number, field: keyof Rule, value: any) => {
    const newGroups = [...groups];
    newGroups[groupIndex].ranges[ruleIndex] = { 
      ...newGroups[groupIndex].ranges[ruleIndex], 
      [field]: value 
    };
    setGroups(newGroups);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-bold text-slate-700">Reglas de Evaluación</h4>
        <Button type="button" size="sm" onClick={addGroup} className="bg-slate-800 text-white">
          <Layers className="h-3 w-3 mr-1" /> Nueva Columna a Evaluar
        </Button>
      </div>

      {groups.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg bg-slate-50">
          <p className="text-sm text-slate-500">No hay reglas definidas.</p>
          <p className="text-xs text-slate-400">Agrega una columna para empezar a configurar ponderaciones.</p>
        </div>
      )}

      {groups.map((group, gIndex) => (
        <Card key={gIndex} className="border border-slate-200 shadow-sm relative">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
            onClick={() => removeGroup(gIndex)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <CardHeader className="pb-2 bg-slate-50/50">
            <div className="grid grid-cols-3 gap-4 pr-8">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Columna Excel</label>
                <input 
                  className="w-full p-1 border rounded text-xs font-mono"
                  placeholder="Ej: CO (CO2e)"
                  value={group.target}
                  onChange={(e) => updateGroup(gIndex, 'target', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Nombre Puntaje</label>
                <input 
                  className="w-full p-1 border rounded text-xs"
                  placeholder="Ej: Puntos CO2e"
                  value={group.output_name}
                  onChange={(e) => updateGroup(gIndex, 'output_name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Tipo Dato</label>
                <select 
                  className="w-full p-1 border rounded text-xs"
                  value={group.type}
                  onChange={(e) => updateGroup(gIndex, 'type', e.target.value)}
                >
                  <option value="number">Numérico (>, &lt;)</option>
                  <option value="text">Texto (=, SI/NO)</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-2">
            {group.ranges.map((rule, rIndex) => (
              <div key={rIndex} className="flex items-center space-x-2 bg-slate-50 p-2 rounded border border-slate-100">
                
                {/* Operador */}
                <div className="w-20">
                  <select
                    className="w-full p-1 border rounded text-xs bg-white"
                    value={rule.operator}
                    onChange={(e) => updateRuleInGroup(gIndex, rIndex, 'operator', e.target.value)}
                  >
                    {group.type === 'number' ? (
                      <>
                        <option value=">">&gt;</option>
                        <option value=">=">&ge;</option>
                        <option value="<">&lt;</option>
                        <option value="<=">&le;</option>
                        <option value="=">=</option>
                      </>
                    ) : (
                      <>
                        <option value="=">Es Igual a</option>
                        <option value="!=">No es Igual a</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Valor */}
                <div className="flex-1">
                  {group.type === 'number' ? (
                    <input
                      type="number"
                      step="0.001"
                      className="w-full p-1 border rounded text-xs"
                      value={rule.value}
                      placeholder="Valor"
                      onChange={(e) => updateRuleInGroup(gIndex, rIndex, 'value', Number(e.target.value))}
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-full p-1 border rounded text-xs"
                      value={rule.value}
                      placeholder='Ej: "SI", "MB"'
                      onChange={(e) => updateRuleInGroup(gIndex, rIndex, 'value', e.target.value)}
                    />
                  )}
                </div>

                {/* Score */}
                <div className="w-24">
                  <select
                    className="w-full p-1 border rounded text-xs font-bold text-gobmx-guinda bg-white"
                    value={rule.score}
                    onChange={(e) => updateRuleInGroup(gIndex, rIndex, 'score', Number(e.target.value))}
                  >
                    <option value={1}>1 (Exc)</option>
                    <option value={2}>2 (Sob)</option>
                    <option value={3}>3 (Ade)</option>
                    <option value={4}>4 (Def)</option>
                    <option value={5}>5 (Cri)</option>
                  </select>
                </div>

                {/* Etiqueta */}
                <div className="flex-[2]">
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={rule.label}
                    onChange={(e) => updateRuleInGroup(gIndex, rIndex, 'label', e.target.value)}
                    placeholder="Etiqueta (Opcional)"
                  />
                </div>

                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeRuleFromGroup(gIndex, rIndex)} 
                  className="h-6 w-6 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}

            <Button type="button" size="sm" variant="outline" onClick={() => addRuleToGroup(gIndex)} className="w-full border-dashed text-slate-500 hover:text-slate-700">
              <Plus className="h-3 w-3 mr-1" /> Agregar Rango
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
