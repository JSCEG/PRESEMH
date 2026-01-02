import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Layers, Trash2 } from 'lucide-react';
import { EvaluationColumn, DataType } from '@/types/indicators';
import NumericRangesEditor from './NumericRangesEditor';
import CategoricalMapEditor from './CategoricalMapEditor';
import BooleanEditor from './BooleanEditor';

interface RuleBuilderProps {
  initialRules: EvaluationColumn[];
  onChange: (rules: EvaluationColumn[]) => void;
}

export default function RuleBuilder({ initialRules, onChange }: RuleBuilderProps) {
  const [columns, setColumns] = useState<EvaluationColumn[]>(initialRules || []);

  // Sincronizar estado interno si initialRules cambia externamente (ej: al reabrir el modal)
  useEffect(() => {
    if (initialRules) setColumns(initialRules);
  }, [initialRules]);

  useEffect(() => {
    onChange(columns);
  }, [columns]);

  const addColumn = () => {
    setColumns([...columns, {
      id: crypto.randomUUID(),
      excel_column_key: '',
      display_name: '',
      data_type: 'number',
      scoring_method: 'numeric_ranges',
      column_weight: 1,
      ranges: []
    }]);
  };

  const removeColumn = (index: number) => {
    const newCols = columns.filter((_, i) => i !== index);
    setColumns(newCols);
  };

  const updateColumn = (index: number, field: keyof EvaluationColumn, value: any) => {
    const newCols = [...columns];
    newCols[index] = { ...newCols[index], [field]: value };

    // Resetear reglas si cambia el tipo
    if (field === 'scoring_method') {
      newCols[index].ranges = [];
      newCols[index].categories = [];
      newCols[index].boolean_config = undefined;
    }

    setColumns(newCols);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Columnas a Evaluar</h3>
        <Button type="button" onClick={addColumn} className="bg-slate-800 text-white hover:bg-slate-700">
          <Layers className="h-4 w-4 mr-2" /> Nueva Columna
        </Button>
      </div>

      {columns.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg bg-slate-50">
          <p className="text-sm text-slate-500">Este indicador no evalúa ninguna columna aún.</p>
        </div>
      )}

      {columns.map((col, index) => (
        <Card key={col.id} className="border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gobmx-guinda"></div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
            onClick={() => removeColumn(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <CardHeader className="pb-2 bg-slate-50/50 pl-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-8">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Columna Excel</label>
                <input
                  className="w-full p-1 border rounded text-xs font-mono bg-white"
                  placeholder="Ej: Maximos"
                  value={col.excel_column_key}
                  onChange={(e) => updateColumn(index, 'excel_column_key', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Nombre Visible</label>
                <input
                  className="w-full p-1 border rounded text-xs bg-white"
                  placeholder="Ej: Temp. Máxima"
                  value={col.display_name}
                  onChange={(e) => updateColumn(index, 'display_name', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Tipo Dato</label>
                <select
                  className="w-full p-1 border rounded text-xs bg-white"
                  value={col.data_type}
                  onChange={(e) => {
                    const newType = e.target.value as DataType;
                    // Crear una copia profunda del objeto columna para asegurar reactividad
                    const updatedCol = { ...col, data_type: newType };

                    // Auto-seleccionar método default
                    if (newType === 'number') updatedCol.scoring_method = 'numeric_ranges';
                    if (newType === 'categorical') updatedCol.scoring_method = 'categorical_map';
                    if (newType === 'boolean') updatedCol.scoring_method = 'boolean';

                    // Resetear reglas
                    updatedCol.ranges = [];
                    updatedCol.categories = [];
                    updatedCol.boolean_config = undefined;

                    // Actualizar estado global
                    const newCols = [...columns];
                    newCols[index] = updatedCol;
                    setColumns(newCols);
                  }}
                >
                  <option value="number">Numérico</option>
                  <option value="categorical">Categórico (Texto)</option>
                  <option value="boolean">Booleano (Sí/No)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Método Evaluación</label>
                <select
                  className="w-full p-1 border rounded text-xs bg-white"
                  value={col.scoring_method}
                  onChange={(e) => updateColumn(index, 'scoring_method', e.target.value)}
                >
                  {col.data_type === 'number' && <option value="numeric_ranges">Rangos Numéricos</option>}
                  {col.data_type === 'categorical' && <option value="categorical_map">Mapeo Exacto</option>}
                  {col.data_type === 'boolean' && <option value="boolean">Verdadero / Falso</option>}
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 pl-6">
            {col.scoring_method === 'numeric_ranges' && (
              <NumericRangesEditor
                initialRanges={col.ranges || []}
                onChange={(ranges) => updateColumn(index, 'ranges', ranges)}
              />
            )}
            {col.scoring_method === 'categorical_map' && (
              <CategoricalMapEditor
                initialCategories={col.categories || []}
                onChange={(cats) => updateColumn(index, 'categories', cats)}
              />
            )}
            {col.scoring_method === 'boolean' && (
              <BooleanEditor
                initialConfig={col.boolean_config}
                onChange={(cfg) => updateColumn(index, 'boolean_config', cfg)}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
