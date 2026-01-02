import DataImporter from '@/components/admin/DataImporter';

export default function ImportPage() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gobmx-guinda mb-2 font-headings">Importación Masiva</h1>
        <p className="text-slate-500 mb-8">
          Carga de datos históricos desde archivos Excel.
        </p>
        <DataImporter />
      </div>
    </div>
  );
}
