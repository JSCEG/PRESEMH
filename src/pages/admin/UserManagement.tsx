import { useEffect, useState } from 'react';
import { adminService, UserProfile } from '@/services/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from 'lucide-react'; // Placeholder, usaremos span con clases
import { Loader2, Check, X, ShieldAlert } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id: string) => {
    // Por defecto aprobamos como VIEWER, luego se podría elegir el rol en un modal
    await adminService.approveUser(id, 'VIEWER');
    fetchUsers();
  };

  const handleReject = async (id: string) => {
    await adminService.rejectUser(id);
    fetchUsers();
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gobmx-guinda" /></div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gobmx-guinda mb-6 font-headings">Gestión de Usuarios</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes de Acceso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-600 uppercase font-bold">
                  <tr>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Rol</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Fecha Registro</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'ANALYST' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          user.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                          user.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.status === 'PENDING' ? 'PENDIENTE' : user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {user.status === 'PENDING' && (
                          <>
                            <Button size="sm" onClick={() => handleApprove(user.id)} className="bg-green-600 hover:bg-green-700 text-white">
                              <Check className="h-4 w-4 mr-1" /> Aprobar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(user.id)}>
                              <X className="h-4 w-4 mr-1" /> Rechazar
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-500">
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
