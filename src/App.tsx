import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserManagement from '@/pages/admin/UserManagement';
import IndicatorsManagement from '@/pages/admin/IndicatorsManagement';
import ImportPage from '@/pages/admin/ImportPage';

function App() {
  useEffect(() => {
    const getToken = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("🔑 Access Token:", data.session?.access_token);
    };
    getToken();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/map" element={<Dashboard />} />
          
          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<UserManagement />} />
            <Route path="/admin/indicators" element={<IndicatorsManagement />} />
            <Route path="/admin/import" element={<ImportPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;