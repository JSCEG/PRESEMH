import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Map as MapIcon, 
  Settings, 
  LogOut, 
  User, 
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Mapa Interactivo', icon: MapIcon, path: '/map', public: true },
    { label: 'Gestión de Indicadores', icon: Settings, path: '/admin', public: false },
    { label: 'Información del Proyecto', icon: Info, path: '/info', public: true },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(true)}
            className="text-gobmx-guinda"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex flex-col">
            <span className="text-gobmx-guinda font-headings font-bold text-sm md:text-base leading-none">
              PRESEMH
            </span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              Eficiencia Energética
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <img src="https://cdn.sassoapps.com/Indicadores_Eficiencia/logo_sener.png" alt="SENER" className="h-8 md:h-10 object-contain" />
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Drawer */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-72 bg-white z-[70] shadow-2xl transition-transform duration-300 ease-in-out transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <img src="https://cdn.sassoapps.com/Indicadores_Eficiencia/logo_gob.png" alt="GobMX" className="h-8" />
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5 text-slate-500" />
          </Button>
        </div>

        <div className="p-4 flex flex-col h-[calc(100%-180px)] overflow-y-auto">
          {/* Perfil del Usuario */}
          <div className="mb-8 p-4 bg-gobmx-guinda-light rounded-lg border border-gobmx-guinda/10">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gobmx-guinda flex items-center justify-center text-white font-bold">
                {user ? user.email?.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-slate-800 truncate">
                  {user ? user.email : 'Acceso Público'}
                </span>
                <span className="text-[10px] text-gobmx-guinda font-bold uppercase">
                  {user ? 'Institucional' : 'Visitante'}
                </span>
              </div>
            </div>
          </div>

          {/* Menú de Navegación */}
          <div className="space-y-1">
            {menuItems.map((item) => {
              if (!item.public && !user) return null;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-md text-slate-600 hover:bg-slate-50 hover:text-gobmx-guinda transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer del Menú */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-slate-50">
          {user ? (
            <Button 
              variant="outline" 
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
            </Button>
          ) : (
            <Button 
              className="w-full bg-gobmx-guinda text-white"
              onClick={() => {
                navigate('/login');
                setIsOpen(false);
              }}
            >
              Iniciar Sesión
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
