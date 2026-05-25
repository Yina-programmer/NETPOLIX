const XLSX = require('xlsx');

/**
 * Parse an Excel file and return JSON data
 * @param {string} filePath - Path to the Excel file
 * @param {Object} options - Parsing options
 * @returns {Object} { data: Array, errors: Array, totalRows: number }
 */
function parseExcel(filePath, options = {}) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = options.sheetName || workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    return { data: [], errors: [{ row: 0, message: 'Hoja no encontrada' }], totalRows: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  const errors = [];
  const data = [];

  // Column mapping for movies
  const movieColumnMap = {
    'ISAN': 'isan',
    'isan': 'isan',
    'Título': 'title',
    'titulo': 'title',
    'title': 'title',
    'Título Original': 'title',
    'Año': 'year',
    'año': 'year',
    'year': 'year',
    'Año de Producción': 'year',
    'Duración': 'duration',
    'duracion': 'duration',
    'duration': 'duration',
    'Duración (min)': 'duration',
    'Clasificación': 'classification',
    'clasificacion': 'classification',
    'classification': 'classification',
    'Categorías': 'categories',
    'categorias': 'categories',
    'categories': 'categories',
    'Idioma Original': 'originalLanguage',
    'idioma': 'originalLanguage',
    'language': 'originalLanguage',
    'Subtítulos': 'subtitles',
    'subtitulos': 'subtitles',
    'subtitles': 'subtitles',
    'Doblajes': 'dubbing',
    'doblajes': 'dubbing',
    'dubbing': 'dubbing',
    'Actores': 'actors',
    'actores': 'actors',
    'actors': 'actors',
    'Directores': 'directors',
    'directores': 'directors',
    'directors': 'directors',
    'Productores': 'producers',
    'productores': 'producers',
    'producers': 'producers',
    'Calificación': 'rating',
    'calificacion': 'rating',
    'rating': 'rating',
    'Precio Venta': 'salePrice',
    'precio_venta': 'salePrice',
    'Precio Alquiler': 'rentalPrice',
    'precio_alquiler': 'rentalPrice',
    'Imagen': 'imageUrl',
    'imagen': 'imageUrl',
    'image': 'imageUrl'
  };

  rawData.forEach((row, index) => {
    const rowNum = index + 2; // Excel rows start at 1, header is row 1
    const mapped = {};
    const rowErrors = [];

    // Map columns
    Object.keys(row).forEach(key => {
      const mappedKey = movieColumnMap[key.trim()];
      if (mappedKey) {
        mapped[mappedKey] = row[key];
      }
    });

    // Validate required fields
    if (!mapped.title) {
      rowErrors.push('Título es requerido');
    }
    if (!mapped.isan) {
      rowErrors.push('ISAN es requerido');
    }

    // Parse comma-separated fields
    if (mapped.categories && typeof mapped.categories === 'string') {
      mapped.categories = mapped.categories.split(',').map(c => c.trim()).filter(Boolean);
    } else {
      mapped.categories = [];
    }

    if (mapped.subtitles && typeof mapped.subtitles === 'string') {
      mapped.subtitles = mapped.subtitles.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      mapped.subtitles = [];
    }

    if (mapped.dubbing && typeof mapped.dubbing === 'string') {
      mapped.dubbing = mapped.dubbing.split(',').map(d => d.trim()).filter(Boolean);
    } else {
      mapped.dubbing = [];
    }

    if (mapped.actors && typeof mapped.actors === 'string') {
      mapped.actors = mapped.actors.split(',').map(a => a.trim()).filter(Boolean);
    } else {
      mapped.actors = [];
    }

    if (mapped.directors && typeof mapped.directors === 'string') {
      mapped.directors = mapped.directors.split(',').map(d => d.trim()).filter(Boolean);
    } else {
      mapped.directors = [];
    }

    if (mapped.producers && typeof mapped.producers === 'string') {
      mapped.producers = mapped.producers.split(',').map(p => p.trim()).filter(Boolean);
    } else {
      mapped.producers = [];
    }

    // Parse numeric fields
    if (mapped.year) mapped.year = parseInt(mapped.year) || null;
    if (mapped.duration) mapped.duration = parseInt(mapped.duration) || null;
    if (mapped.salePrice) mapped.salePrice = parseFloat(mapped.salePrice) || 0;
    if (mapped.rentalPrice) mapped.rentalPrice = parseFloat(mapped.rentalPrice) || 0;

    // Validate classification
    const validClassifications = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
    if (mapped.classification && !validClassifications.includes(mapped.classification.toUpperCase())) {
      rowErrors.push(`Clasificación inválida: ${mapped.classification}. Debe ser: ${validClassifications.join(', ')}`);
    } else if (mapped.classification) {
      mapped.classification = mapped.classification.toUpperCase();
    }

    // Validate rating
    const validRatings = ['excelente', 'buena', 'regular', 'mala'];
    if (mapped.rating && !validRatings.includes(mapped.rating.toLowerCase())) {
      rowErrors.push(`Calificación inválida: ${mapped.rating}. Debe ser: ${validRatings.join(', ')}`);
    } else if (mapped.rating) {
      mapped.rating = mapped.rating.toLowerCase();
    }

    if (rowErrors.length > 0) {
      errors.push({ row: rowNum, messages: rowErrors });
    } else {
      data.push(mapped);
    }
  });

  return {
    data,
    errors,
    totalRows: rawData.length,
    successCount: data.length,
    errorCount: errors.length
  };
}

/**
 * Generate an Excel template for movie imports
 * @returns {Buffer} Excel file buffer
 */
function generateMovieTemplate() {
  const headers = [
    'ISAN', 'Título Original', 'Año de Producción', 'Duración (min)',
    'Clasificación', 'Categorías', 'Idioma Original', 'Subtítulos',
    'Doblajes', 'Actores', 'Directores', 'Productores',
    'Calificación', 'Precio Venta', 'Precio Alquiler', 'Imagen'
  ];

  const exampleData = [
    {
      'ISAN': 'ISAN-0001-0001',
      'Título Original': 'Ejemplo de Película',
      'Año de Producción': 2024,
      'Duración (min)': 120,
      'Clasificación': 'PG-13',
      'Categorías': 'acción, suspenso',
      'Idioma Original': 'Inglés',
      'Subtítulos': 'Español, Francés',
      'Doblajes': 'Español, Portugués',
      'Actores': 'Actor 1, Actor 2',
      'Directores': 'Director 1',
      'Productores': 'Productor 1',
      'Calificación': 'excelente',
      'Precio Venta': 14.99,
      'Precio Alquiler': 4.99,
      'Imagen': 'https://ejemplo.com/poster.jpg'
    }
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exampleData, { header: headers });
  
  // Set column widths
  ws['!cols'] = headers.map(h => ({ wch: Math.max(h.length + 2, 15) }));
  
  XLSX.utils.book_append_sheet(wb, ws, 'Películas');
  
  // Add instructions sheet
  const instructions = [
    { 'Instrucciones': 'Complete cada fila con la información de una película.' },
    { 'Instrucciones': 'Campos requeridos: ISAN, Título Original' },
    { 'Instrucciones': 'Clasificaciones válidas: G, PG, PG-13, R, NC-17' },
    { 'Instrucciones': 'Calificaciones válidas: excelente, buena, regular, mala' },
    { 'Instrucciones': 'Para múltiples valores, sepárelos con comas (ej: "acción, suspenso")' },
    { 'Instrucciones': 'No modifique los encabezados de las columnas.' }
  ];
  const wsInst = XLSX.utils.json_to_sheet(instructions);
  wsInst['!cols'] = [{ wch: 70 }];
  XLSX.utils.book_append_sheet(wb, wsInst, 'Instrucciones');

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

module.exports = { parseExcel, generateMovieTemplate };
