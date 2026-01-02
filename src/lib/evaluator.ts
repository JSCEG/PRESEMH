import { EvaluationColumn, RangeRule } from '@/types/indicators';

/**
 * Evalúa un valor individual contra un set de reglas de una columna
 */
export function evaluateValue(column: EvaluationColumn, value: any): number {
  if (value === undefined || value === null) return 0;

  // 1. Evaluación Numérica (Rangos)
  if (column.scoring_method === 'numeric_ranges' && column.ranges) {
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numValue)) return 0;

    // Buscar la primera regla que coincida (orden de importancia)
    for (const range of column.ranges) {
      if (checkNumericRule(numValue, range)) {
        return range.score;
      }
    }
  }

  // 2. Evaluación Categórica (Mapeo de Texto)
  if (column.scoring_method === 'categorical_map' && column.categories) {
    const strValue = String(value).trim().toUpperCase();
    const match = column.categories.find(c => c.value.trim().toUpperCase() === strValue);
    if (match) return match.score;
  }

  // 3. Evaluación Booleana
  if (column.scoring_method === 'boolean' && column.boolean_config) {
    const boolValue = (value === true || value === 'SI' || value === 'TRUE' || value === 1 || value === '1');
    return boolValue ? column.boolean_config.trueScore : column.boolean_config.falseScore;
  }

  return 0; // Sin coincidencia
}

function checkNumericRule(val: number, rule: RangeRule): boolean {
  switch (rule.op) {
    case '>': return val > rule.value;
    case '>=': return val >= rule.value;
    case '<': return val < rule.value;
    case '<=': return val <= rule.value;
    case '=': return val === rule.value;
    case 'between': return val >= rule.value && val <= (rule.max || rule.value);
    default: return false;
  }
}

/**
 * Calcula el puntaje total de un indicador sumando sus columnas evaluadas
 */
export function computeIndicatorScore(rowData: Record<string, any>, indicator: any): number {
  const columns = indicator.evaluation_rules as EvaluationColumn[];
  if (!columns || columns.length === 0) return 0;

  let totalScore = 0;
  columns.forEach(col => {
    const val = rowData[col.excel_column_key];
    const score = evaluateValue(col, val);
    totalScore += score * (col.column_weight || 1);
  });

  return totalScore;
}
