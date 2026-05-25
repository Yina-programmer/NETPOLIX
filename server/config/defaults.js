/**
 * Default configuration values for NetPolix
 */
module.exports = {
  // Pricing defaults
  pricing: {
    movieRentalPrice: 4.99,
    movieSalePrice: 14.99,
    seriesRentalPrice: 7.99,
    seriesSalePrice: 24.99,
    collectionRentalPrice: 12.99,
    collectionSalePrice: 39.99
  },
  
  // Points system
  points: {
    pointsPerRental: 10,
    pointsPerSale: 25,
    pointsPerReferral: 50,
    pointsRedemptionRate: 100, // 100 points = $1 discount
  },

  // Valid classifications
  classifications: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
  
  // Valid ratings
  ratings: ['excelente', 'buena', 'regular', 'mala'],
  
  // Default languages
  defaultLanguages: [
    'Inglés', 'Español', 'Portugués', 'Alemán',
    'Japonés', 'Francés', 'Italiano', 'Ruso', 'Chino'
  ],

  // Default categories
  defaultCategories: [
    'Comedia', 'Terror', 'Acción', 'Suspenso', 'Drama', 'Independiente'
  ],

  // Password validation
  passwordMinLength: 7,
  passwordMaxLength: 15,
  emailMinLength: 6,
  emailMaxLength: 25
};
