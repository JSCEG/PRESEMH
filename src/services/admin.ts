import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
}

export const adminService = {
  /**
   * Obtener todos los perfiles de usuario
   */
  async getUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as UserProfile[];
  },

  /**
   * Aprobar un usuario y asignarle un rol
   */
  async approveUser(userId: string, role: 'ADMIN' | 'ANALYST' | 'VIEWER') {
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'APPROVED', role })
      .eq('id', userId);

    if (error) throw error;
  },

  /**
   * Rechazar (o bloquear) un usuario
   */
  async rejectUser(userId: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'REJECTED' })
      .eq('id', userId);

    if (error) throw error;
  }
};
