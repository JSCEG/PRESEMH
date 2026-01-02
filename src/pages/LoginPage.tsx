import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertCircle, ArrowLeft, Mail, Lock, User, Phone } from 'lucide-react';

type AuthMode = 'LOGIN' | 'REGISTER' | 'RECOVERY';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const validDomains = ['energia.gob.mx', 'gmail.com', 'outlook.com', 'hotmail.com'];
    const domain = email.split('@')[1];
    if (!domain || !validDomains.includes(domain)) {
      return false;
    }
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (mode === 'REGISTER') {
      if (!validateEmail(email)) {
        setMessage({ type: 'error', text: 'Dominio de correo no permitido.' });
        return;
      }
      
      if (password.length < 6) {
        setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
        return;
      }

      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      if (!nameRegex.test(fullName) || fullName.length < 3) {
        setMessage({ type: 'error', text: 'El nombre contiene caracteres inválidos o es muy corto.' });
        return;
      }

      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setMessage({ type: 'error', text: 'El teléfono debe tener 10 dígitos numéricos.' });
        return;
      }

      const sanitizedPhone = cleanPhone;
      const sanitizedName = fullName.trim();

      setLoading(true);

      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: sanitizedName,
              phone: sanitizedPhone
            }
          }
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Registro exitoso. Verifique su correo.' });
        setMode('LOGIN');
        setPassword('');
      } catch (error: any) {
        setMessage({ type: 'error', text: error.message || 'Ocurrió un error.' });
      } finally {
        setLoading(false);
      }
      return; 
    }

    setLoading(true);

    try {
      if (mode === 'LOGIN') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/map');
      } 
      else if (mode === 'RECOVERY') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/update-password',
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Se ha enviado un enlace de recuperación.' });
        setMode('LOGIN');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Ocurrió un error inesperado.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="p-4 bg-white border-b border-slate-200">
        <Button variant="ghost" onClick={() => navigate('/')} className="text-gobmx-guinda hover:text-gobmx-guinda/80">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio
        </Button>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-t-8 border-gobmx-guinda shadow-2xl">
          <CardHeader className="text-center space-y-1">
            <div className="flex justify-center mb-4">
              <img src="https://cdn.sassoapps.com/Indicadores_Eficiencia/logo_sener.png" alt="SENER" className="h-12" />
            </div>
            <CardTitle className="text-2xl font-bold font-headings text-slate-800">
              {mode === 'LOGIN' && 'Acceso Institucional'}
              {mode === 'REGISTER' && 'Solicitud de Cuenta'}
              {mode === 'RECOVERY' && 'Recuperar Contraseña'}
            </CardTitle>
            <CardDescription>
              {mode === 'LOGIN' && 'Ingrese sus credenciales para acceder.'}
              {mode === 'REGISTER' && 'Complete sus datos para solicitar acceso.'}
              {mode === 'RECOVERY' && 'Le enviaremos un enlace seguro.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              
              {mode === 'REGISTER' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-gobmx-dorado focus:border-transparent outline-none"
                        placeholder="Juan Pérez"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Teléfono</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 10) setPhone(val);
                        }}
                        className="w-full pl-10 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-gobmx-dorado focus:border-transparent outline-none"
                        placeholder="5512345678"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-gobmx-dorado focus:border-transparent outline-none transition-all"
                    placeholder="usuario@energia.gob.mx"
                  />
                </div>
              </div>

              {mode !== 'RECOVERY' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-gobmx-dorado focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {message && (
                <div className={`flex items-center p-3 text-sm border rounded-md ${
                  message.type === 'error' ? 'text-red-800 border-red-200 bg-red-50' : 'text-green-800 border-green-200 bg-green-50'
                }`}>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {message.text}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gobmx-guinda hover:bg-[#7a1b38] text-white py-6"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                 mode === 'LOGIN' ? 'Iniciar Sesión' : 
                 mode === 'REGISTER' ? 'Enviar Solicitud' : 'Enviar Enlace'}
              </Button>
            </form>
            
            <div className="mt-6 flex flex-col space-y-2 text-center text-sm">
              {mode === 'LOGIN' ? (
                <>
                  <button type="button" onClick={() => setMode('REGISTER')} className="text-gobmx-guinda hover:underline font-medium">
                    ¿No tiene cuenta? Solicite acceso aquí
                  </button>
                  <button type="button" onClick={() => setMode('RECOVERY')} className="text-slate-500 hover:text-slate-700 text-xs">
                    Olvidé mi contraseña
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setMode('LOGIN')} className="text-gobmx-guinda hover:underline font-medium">
                  Volver al inicio de sesión
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}