import { useState, useEffect } from 'react';
import { BooleanRule } from '@/types/indicators';

interface BooleanEditorProps {
  initialConfig?: BooleanRule;
  onChange: (config: BooleanRule) => void;
}

export default function BooleanEditor({ initialConfig, onChange }: BooleanEditorProps) {
  const [config, setConfig] = useState<BooleanRule>(initialConfig || { trueScore: 1, falseScore: 5 });

  useEffect(() => {
    if (initialConfig) setConfig(initialConfig);
  }, [initialConfig]);

  useEffect(() => {
    onChange(config);
  }, [config]);

  return (
    <div className="space-y-2 bg-slate-50 p-3 rounded border">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Si es VERDADERO (True) &rarr;</span>
        <select
          className="w-32 p-1 border rounded text-xs font-bold text-gobmx-guinda"
          value={config.trueScore}
          onChange={(e) => setConfig({ ...config, trueScore: Number(e.target.value) as any })}
        >
          <option value={1}>1 (Excelente)</option>
          <option value={5}>5 (Crítico)</option>
        </select>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Si es FALSO (False) &rarr;</span>
        <select
          className="w-32 p-1 border rounded text-xs font-bold text-gobmx-guinda"
          value={config.falseScore}
          onChange={(e) => setConfig({ ...config, falseScore: Number(e.target.value) as any })}
        >
          <option value={1}>1 (Excelente)</option>
          <option value={5}>5 (Crítico)</option>
        </select>
      </div>
    </div>
  );
}
