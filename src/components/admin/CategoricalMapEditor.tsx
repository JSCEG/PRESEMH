import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { CategoryRule } from '@/types/indicators';

interface CategoricalMapEditorProps {
  initialCategories: CategoryRule[];
  onChange: (cats: CategoryRule[]) => void;
}

export default function CategoricalMapEditor({ initialCategories, onChange }: CategoricalMapEditorProps) {
  const [categories, setCategories] = useState<CategoryRule[]>(initialCategories || []);

  useEffect(() => {
    setCategories(initialCategories || []);
  }, [initialCategories]);

  useEffect(() => {
    onChange(categories);
  }, [categories]);

  const addCategory = () => {
    setCategories([...categories, { value: '', score: 1, label: '' }]);
  };

  const removeCategory = (index: number) => {
    const newCats = categories.filter((_, i) => i !== index);
    setCategories(newCats);
  };

  const updateCategory = (index: number, field: keyof CategoryRule, value: any) => {
    const newCats = [...categories];
    newCats[index] = { ...newCats[index], [field]: value };
    setCategories(newCats);
  };

  return (
    <div className="space-y-2">
      {categories.map((cat, index) => (
        <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded border">
          <span className="text-xs font-bold text-slate-500">Si es:</span>

          <input
            className="flex-1 p-1 border rounded text-xs"
            value={cat.value}
            onChange={(e) => updateCategory(index, 'value', e.target.value)}
            placeholder='Valor (Ej: "SI")'
          />

          <span className="text-xs text-slate-400">&rarr;</span>

          <select
            className="w-24 p-1 border rounded text-xs font-bold text-gobmx-guinda"
            value={cat.score}
            onChange={(e) => updateCategory(index, 'score', Number(e.target.value))}
          >
            <option value={1}>1 (Exc)</option>
            <option value={2}>2 (Sob)</option>
            <option value={3}>3 (Ade)</option>
            <option value={4}>4 (Def)</option>
            <option value={5}>5 (Cri)</option>
          </select>

          <Button type="button" variant="ghost" size="icon" onClick={() => removeCategory(index)} className="h-6 w-6 text-red-500">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={addCategory} className="w-full text-xs h-7">
        <Plus className="h-3 w-3 mr-1" /> Agregar Mapeo
      </Button>
    </div>
  );
}
