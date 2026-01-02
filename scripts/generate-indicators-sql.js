import XLSX from 'xlsx';

const filePath = '20251125 Indicadores PRESEMH.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = '28 Indicadores';
    const worksheet = workbook.Sheets[sheetName];
    
    // Leer los datos (empezando desde la fila donde están los nombres)
    const data = XLSX.utils.sheet_to_json(worksheet, { range: 0 });
    
    console.log('--- Script de Inserción SQL ---');
    console.log('INSERT INTO indicators (code, name, dimension, metadata, weight) VALUES');

    data.forEach((row, index) => {
        const name = row['Indicador'] || row['Nombre del indicador'];
        if (!name) return;

        const code = name.toUpperCase().replace(/\s+/g, '_').substring(0, 20);
        const dimension = row['Dimensión'] || 'Ambiental';
        const metadata = {
            source: row['Fuente'] || '',
            url: row['Enlaces'] || '',
            period: row['Periodo de Datos'] || ''
        };

        const comma = index === data.length - 1 ? ';' : ',';
        console.log(`('${code}', '${name}', '${dimension}', '${JSON.stringify(metadata)}', 1.0)${comma}`);
    });

} catch (error) {
    console.error('Error:', error.message);
}
