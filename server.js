require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/templates', express.static(path.join(__dirname, 'templates')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// API Routes
app.use('/api/auth', require('./server/routes/auth.routes'));
app.use('/api/movies', require('./server/routes/movies.routes'));
app.use('/api/series', require('./server/routes/series.routes'));
app.use('/api/people', require('./server/routes/people.routes'));
app.use('/api/languages', require('./server/routes/languages.routes'));
app.use('/api/categories', require('./server/routes/categories.routes'));
app.use('/api/classifications', require('./server/routes/classifications.routes'));
app.use('/api/collections', require('./server/routes/collections.routes'));
app.use('/api/clients', require('./server/routes/clients.routes'));
app.use('/api/orders', require('./server/routes/orders.routes'));
app.use('/api/reports', require('./server/routes/reports.routes'));
app.use('/api/config', require('./server/routes/config.routes'));
app.use('/api/upload', require('./server/routes/upload.routes'));

// SPA Fallback - serve index.html for client-side routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all for HTML pages
app.get('*.html', (req, res) => {
  const filePath = path.join(__dirname, 'public', req.path);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║                                              ║
  ║   🎬  NetPolix Server Running                ║
  ║   🌐  http://localhost:${PORT}                  ║
  ║   📂  Serving from /public                   ║
  ║   🗄️  Database: PostgreSQL (Prisma)           ║
  ║                                              ║
  ╚══════════════════════════════════════════════╝
  `);
});
