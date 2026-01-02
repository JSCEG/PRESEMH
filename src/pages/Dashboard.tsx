import Navigation from '@/components/Navigation';
import MapViewer from '@/components/MapViewer';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100 overflow-hidden flex flex-col">
      <Navigation />
      
      <main className="flex-grow pt-16 relative">
        {/* Contenedor del Mapa */}
        <div className="absolute inset-0 bg-slate-200">
          <MapViewer />
        </div>

        {/* Placeholder para el Bottom Sheet (Fase 3.4) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 md:hidden pointer-events-none">
          <div className="bg-white rounded-t-xl shadow-2xl p-4 border-t border-slate-200 min-h-[80px] flex items-center justify-center pointer-events-auto">
            <div className="w-12 h-1 bg-slate-200 rounded-full absolute top-2"></div>
            <p className="text-xs text-slate-400">Seleccione un municipio en el mapa</p>
          </div>
        </div>
      </main>
    </div>
  );
}