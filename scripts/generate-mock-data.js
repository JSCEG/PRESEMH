import XLSX from 'xlsx';
import fs from 'fs';

const filePath = '20251125 Indicadores PRESEMH.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = 'BASE PUNTAJE FINAL';
    const worksheet = workbook.Sheets[sheetName];
    
    // Leer los datos
    const rawData = XLSX.utils.sheet_to_json(worksheet, { range: 1 });
    
    // Transformar a un formato útil para el mapa (CVEGEO -> Score)
    const indicators = rawData.map(row => {
        // Asegurar que el ID sea string de 5 dígitos (CVEGEO)
        const id = String(row.ID).padStart(5, '0');
        return {
            id,
            municipio: row.Municipio,
            estado: row.Estado,
            score: row['TOTAL DE PUNTOS'],
            indicators: {
                densidad: row['Densidad de Población'],
                pueblo_magico: row['Pueblo Mágico'],
                salud: row['Acceso a Salud'],
                pobreza: row['Índice de pobreza'],
                luminarias: row['% de luminarias fuera de funcionamiento']
            }
        };
    }).filter(item => item.id !== '00NaN' && item.id !== '00000');

    // Guardar una muestra de 50 municipios para el MVP
    const sample = indicators.slice(0, 100);
    
    if (!fs.existsSync('src/data')) {
        fs.mkdirSync('src/data', { recursive: true });
    }
    
    fs.writeFileSync('src/data/mockIndicators.json', JSON.stringify(sample, null, 2));
    console.log('Mock de indicadores creado con ' + sample.length + ' municipios.');

} catch (error) {
    console.error('Error:', error.message);
}
