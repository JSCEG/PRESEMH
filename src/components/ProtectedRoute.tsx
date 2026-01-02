import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const { user, loading, session } = useAuth();

  // Aquí deberíamos obtener también el rol del perfil, no solo la sesión de auth.
  // Por simplicidad del MVP, asumimos que si está logueado tiene acceso básico,
  // pero para ADMIN necesitaremos consultar la tabla 'profiles'.
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gobmx-guinda h-8 w-8" /></div>;
  }

  if (!session || !user) {
    return <Navigate to="/login" replace />;
  }

  // TODO: Validar rol específico consultando 'profiles' si requiredRole está definido.
  
  return <Outlet />;
}
