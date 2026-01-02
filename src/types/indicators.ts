export type DataType = 'number' | 'categorical' | 'boolean';
export type ScoringMethod = 'numeric_ranges' | 'categorical_map' | 'boolean';
export type Direction = 'higher_is_better' | 'higher_is_worse' | 'neutral'; // Para ayudas visuales

export interface RangeRule {
  score: 1 | 2 | 3 | 4 | 5;
  label: string; // CRÍTICO, EXCELENTE, etc.
  op: '>' | '>=' | '<' | '<=' | '=' | 'between';
  value: number;
  max?: number; // Solo para 'between'
}

export interface CategoryRule {
  value: string;
  score: 1 | 2 | 3 | 4 | 5;
  label: string;
}

export interface BooleanRule {
  trueScore: 1 | 2 | 3 | 4 | 5;
  falseScore: 1 | 2 | 3 | 4 | 5;
}

export interface EvaluationColumn {
  id: string; // UUID para key en React
  excel_column_key: string; // Nombre en Excel
  display_name: string; // Nombre amigable
  data_type: DataType;
  scoring_method: ScoringMethod;
  column_weight: number; // Peso de esta columna (default 1)
  
  // Dependiendo del método, uno de estos estará poblado
  ranges?: RangeRule[];
  categories?: CategoryRule[];
  boolean_config?: BooleanRule;
}

export interface Indicator {
  id: string;
  code: string;
  name: string;
  dimension: string;
  weight: number;
  metadata: Record<string, any>;
  evaluation_rules: EvaluationColumn[]; // Array de columnas a evaluar
  created_at: string;
}
