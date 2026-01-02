import XLSX from 'xlsx';

const filePath = '20251125 Indicadores PRESEMH.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = 'Matriz de indicadores';
    const worksheet = workbook.Sheets[sheetName];
    
    // Los indicadores empiezan en la columna 4 (índice 3)
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 2 });
    const headers = data[0];
    
    console.log('--- Script de Inserción SQL ---');
    console.log('INSERT INTO indicators (code, name, dimension, metadata, weight) VALUES');

    const indicators = headers.slice(3, -1); // Saltar ID, Estado, Municipio y TOTAL
    
    indicators.forEach((name, index) => {
        if (!name) return;
        const code = name.toUpperCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
            .replace(/[^A-Z0-9]/g, '_') // Solo letras y números
            .substring(0, 30);
            
        const dimension = index < 7 ? 'Ambiental' : (index < 20 ? 'Social' : 'Económico'); // Estimado preliminar

        const comma = index === indicators.length - 1 ? ';' : ',';
        console.log(`('${code}', '${name}', '${dimension}', '{}', 1.0)${comma}`);
    });

} catch (error) {
    console.error('Error:', error.message);
}
