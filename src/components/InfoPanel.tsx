import { X, BarChart3, MapPin, Download, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import mockData from '@/data/mockIndicators.json';

interface InfoPanelProps {
  selectedFeature: any | null;
  onClose: () => void;
}

export default function InfoPanel({ selectedFeature, onClose }: InfoPanelProps) {
  if (!selectedFeature) return null;

  const { NOMGEO, CVEGEO } = selectedFeature.properties;
  
  // Buscar datos en el mock
  const data = mockData.find(item => item.id === CVEGEO);
  const score = data ? data.score : 0;
  const indicators = data ? [
    { label: 'Densidad Población', value: data.indicators.densidad === 'SI' ? 'Alta' : 'Baja' },
    { label: 'Acceso a Salud', value: `${data.indicators.salud}/5` },
    { label: 'Pobreza', value: `${data.indicators.pobreza}/5` },
    { label: 'Luminarias Fuera', value: `${data.indicators.luminarias}/5` }
  ] : [
    { label: 'Sin datos registrados', value: '-' }
  ];

  return (
    <>
      {/* Versión Mobile: Bottom Sheet */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-[100] bg-white rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 transform md:hidden",
        selectedFeature ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3" onClick={onClose} />
        <div className="p-6 pt-2 max-h-[70vh] overflow-y-auto">
          <Header title={NOMGEO} subtitle={`Clave: ${CVEGEO}`} onClose={onClose} />
          <Content score={score} indicators={indicators} />
          <Actions />
        </div>
      </div>

      {/* Versión Desktop: Sidebar Derecho */}
      <div className={cn(
        "fixed top-20 right-4 bottom-4 w-96 z-50 bg-white rounded-xl shadow-2xl border border-slate-200 transition-transform duration-300 transform hidden md:flex flex-col",
        selectedFeature ? "translate-x-0" : "translate-x-[120%]"
      )}>
        <div className="p-6 flex-grow overflow-y-auto">
          <Header title={NOMGEO} subtitle={`Municipio - Clave INEGI: ${CVEGEO}`} onClose={onClose} />
          <Content score={score} indicators={indicators} />
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-xl">
          <Actions />
        </div>
      </div>
    </>
  );
}

function Header({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gobmx-guinda font-headings leading-tight">{title}</h2>
        <p className="text-sm text-slate-500 font-medium flex items-center mt-1">
          <MapPin className="h-3 w-3 mr-1" /> {subtitle}
        </p>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}

function Content({ score, indicators }: { score: number; indicators: any[] }) {
  const isHigh = score >= 80;
  const colorClass = isHigh ? "text-gobmx-verde" : "text-gobmx-dorado";

  return (
    <div className="space-y-6">
      {/* Score General */}
      <Card className={cn("border-t-4", isHigh ? "border-gobmx-verde" : "border-gobmx-dorado")}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Eficiencia Global</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <span className={cn("text-5xl font-bold font-headings", colorClass)}>{score}</span>
            <span className="text-slate-400 font-medium">/ 100</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4">
            <div 
              className={cn("h-full rounded-full transition-all duration-1000", isHigh ? "bg-gobmx-verde" : "bg-gobmx-dorado")} 
              style={{ width: `${score}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Indicadores Reales del Excel */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
          <BarChart3 className="h-3 w-3 mr-2" /> Desglose de Indicadores
        </h4>
        {indicators.map((item) => (
          <div key={item.label} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-sm font-medium text-slate-700">{item.label}</span>
            <span className="text-sm font-bold text-gobmx-guinda">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Actions() {
  return (
    <div className="space-y-3">
      <Button className="w-full bg-gobmx-guinda hover:bg-[#7a1b38] text-white py-6 shadow-md group">
        <Download className="mr-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" /> 
        Descargar Informe PDF
      </Button>
      <div className="flex items-center justify-center text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
        <Shield className="h-3 w-3 mr-1" /> Con marca de agua de seguridad
      </div>
    </div>
  );
}