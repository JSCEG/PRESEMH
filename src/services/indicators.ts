import { supabase } from '@/lib/supabase';

export interface Indicator {
  id: string;
  code: string;
  name: string;
  dimension: string;
  weight: number;
  metadata: Record<string, any>;
  data_schema: any[];
  evaluation_rules: any[];
  created_at: string;
}

export const indicatorsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('indicators')
      .select('*')
      .order('code', { ascending: true });

    if (error) throw error;
    return data as Indicator[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('indicators')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Indicator;
  },

  async create(indicator: Partial<Indicator>) {
    const { error } = await supabase
      .from('indicators')
      .insert(indicator);

    if (error) throw error;
  },

  async update(id: string, updates: Partial<Indicator>) {
    const { error } = await supabase
      .from('indicators')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('indicators')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};