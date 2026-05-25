const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const prisma = require('../utils/prismaClient');
const { parseExcel, generateMovieTemplate } = require('../utils/excelParser');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

const upload = multer({ dest: path.join(__dirname, '..', '..', 'uploads') });

// POST /api/upload/movies - Upload Excel file with movies
router.post('/movies', authenticateToken, authorizeRoles('admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Archivo es requerido' });

    const result = parseExcel(req.file.path);
    
    if (result.data.length > 0) {
      const added = [];
      const skipped = [];

      for (const movie of result.data) {
        const existing = await prisma.movie.findFirst({ where: { isan: movie.isan } });
        if (existing) {
          skipped.push({ isan: movie.isan, title: movie.title, reason: 'ISAN duplicado' });
        } else {
          const newMovie = await prisma.movie.create({
            data: {
              id: generateId(),
              isan: movie.isan,
              title: movie.title,
              year: movie.year || 0,
              duration: movie.duration || 0,
              classification: movie.classification || null,
              categories: movie.categories || [],
              originalLanguage: movie.originalLanguage || null,
              subtitles: movie.subtitles || [],
              dubbing: movie.dubbing || [],
              actors: movie.actors || [],
              directors: movie.directors || [],
              producers: movie.producers || [],
              salePrice: movie.salePrice || 0,
              rentalPrice: movie.rentalPrice || 0,
              imageUrl: movie.imageUrl || null,
              description: movie.description || null,
              avgRating: 0,
              totalRatings: 0,
              active: true
            }
          });
          added.push(newMovie);
        }
      }

      res.json({
        message: `Importación completada: ${added.length} añadidas, ${skipped.length} omitidas, ${result.errorCount} errores`,
        added: added.length,
        skipped,
        errors: result.errors,
        totalProcessed: result.totalRows
      });
    } else {
      res.json({
        message: 'No se pudieron importar películas',
        added: 0,
        errors: result.errors,
        totalProcessed: result.totalRows
      });
    }

    // Clean up uploaded file
    const fs = require('fs');
    try { fs.unlinkSync(req.file.path); } catch (e) {}
  } catch (error) {
    res.status(500).json({ error: 'Error procesando el archivo: ' + error.message });
  }
});

// GET /api/upload/template - Download Excel template
router.get('/template', (req, res) => {
  try {
    const buffer = generateMovieTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=plantilla_peliculas_netpolix.xlsx');
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({ error: 'Error generando plantilla: ' + error.message });
  }
});

module.exports = router;
