import XLSX from 'xlsx';
import path from 'path';

const filePath = '20251125 Indicadores PRESEMH.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    console.log('Hojas encontradas:', workbook.SheetNames);

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Leer las primeras 10 filas
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0 });
    console.log('Primeras 5 filas de la hoja "' + firstSheetName + '":');
    console.log(JSON.stringify(data.slice(0, 5), null, 2));

} catch (error) {
    console.error('Error al leer el archivo:', error.message);
}
