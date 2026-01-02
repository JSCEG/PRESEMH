import XLSX from 'xlsx';

const filePath = '20251125 Indicadores PRESEMH.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    
    ['Matriz de indicadores', 'BASE PUNTAJE FINAL', '1 Valores reales municipales(F)'].forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        if (worksheet) {
            console.log('\n--- Hoja: ' + sheetName + ' ---');
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0 });
            // Buscar la primera fila que no sea nula para encontrar encabezados
            let headerRow = 0;
            while(headerRow < 20 && (!data[headerRow] || data[headerRow].length === 0)) {
                headerRow++;
            }
            console.log('Encabezados (Fila ' + headerRow + '):');
            console.log(data[headerRow]);
            console.log('Ejemplo datos (Fila ' + (headerRow + 1) + '):');
            console.log(data[headerRow + 1]);
        }
    });

} catch (error) {
    console.error('Error:', error.message);
}
