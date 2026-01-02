import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Institucional */}
      <header className="bg-white border-b-4 border-gobmx-dorado p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="https://cdn.sassoapps.com/Indicadores_Eficiencia/logo_gob.png" alt="Gobierno de México" className="h-12 object-contain" />
            <div className="h-10 w-px bg-slate-200 hidden md:block" />
            <img src="https://cdn.sassoapps.com/Indicadores_Eficiencia/logo_sener.png" alt="SENER" className="h-10 object-contain" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gobmx-guinda font-headings leading-tight">
              Sistema de Indicadores de Eficiencia Energética (PRESEMH)
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Plataforma geoespacial para la evaluación y seguimiento de la eficiencia energética a nivel estatal y municipal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/login')}
                className="bg-gobmx-guinda hover:bg-[#7a1b38] text-white px-8 py-6 text-lg rounded-md transition-all shadow-md"
              >
                Acceso Institucional
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/map')}
                className="border-gobmx-verde text-gobmx-verde hover:bg-gobmx-verde-light px-8 py-6 text-lg rounded-md transition-all"
              >
                Consulta Pública
              </Button>
            </div>
          </div>

          <Card className="border-l-8 border-gobmx-dorado shadow-xl hidden md:block">
            <CardContent className="p-0 overflow-hidden rounded-r-lg">
              <img 
                src="https://cdn.sassoapps.com/Indicadores_Eficiencia/mujer.png" 
                alt="Eficiencia Energética" 
                className="w-full h-auto object-cover opacity-90 hover:scale-105 transition-transform duration-500"
              />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gobmx-guinda text-white p-6">
        <div className="container mx-auto text-center space-y-2">
          <p className="font-bold">Secretaría de Energía</p>
          <p className="text-sm opacity-80">Dashboard de Eficiencia Energética © 2026 - Protección de Datos Personales</p>
        </div>
      </footer>
    </div>
  );
}
