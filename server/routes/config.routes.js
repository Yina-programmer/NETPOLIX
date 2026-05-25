const router = require('express').Router();
const prisma = require('../utils/prismaClient');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

// Helper: convert flat Config row to nested JSON format
function formatConfig(config) {
  return {
    pricing: {
      movieRentalPrice: config.movieRentalPrice,
      movieSalePrice: config.movieSalePrice,
      seriesRentalPrice: config.seriesRentalPrice,
      seriesSalePrice: config.seriesSalePrice,
      collectionRentalPrice: config.collectionRentalPrice,
      collectionSalePrice: config.collectionSalePrice,
    },
    points: {
      pointsPerRental: config.pointsPerRental,
      pointsPerSale: config.pointsPerSale,
      pointsPerReferral: config.pointsPerReferral,
      pointsRedemptionRate: config.pointsRedemptionRate,
    },
    lastUpdated: config.lastUpdated
  };
}

router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const config = await prisma.config.findUnique({ where: { id: 1 } });
    if (!config) return res.json({});
    res.json(formatConfig(config));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const updateData = { lastUpdated: new Date() };

    if (req.body.pricing) {
      if (req.body.pricing.movieRentalPrice !== undefined) updateData.movieRentalPrice = req.body.pricing.movieRentalPrice;
      if (req.body.pricing.movieSalePrice !== undefined) updateData.movieSalePrice = req.body.pricing.movieSalePrice;
      if (req.body.pricing.seriesRentalPrice !== undefined) updateData.seriesRentalPrice = req.body.pricing.seriesRentalPrice;
      if (req.body.pricing.seriesSalePrice !== undefined) updateData.seriesSalePrice = req.body.pricing.seriesSalePrice;
      if (req.body.pricing.collectionRentalPrice !== undefined) updateData.collectionRentalPrice = req.body.pricing.collectionRentalPrice;
      if (req.body.pricing.collectionSalePrice !== undefined) updateData.collectionSalePrice = req.body.pricing.collectionSalePrice;
    }

    if (req.body.points) {
      if (req.body.points.pointsPerRental !== undefined) updateData.pointsPerRental = req.body.points.pointsPerRental;
      if (req.body.points.pointsPerSale !== undefined) updateData.pointsPerSale = req.body.points.pointsPerSale;
      if (req.body.points.pointsPerReferral !== undefined) updateData.pointsPerReferral = req.body.points.pointsPerReferral;
      if (req.body.points.pointsRedemptionRate !== undefined) updateData.pointsRedemptionRate = req.body.points.pointsRedemptionRate;
    }

    const config = await prisma.config.upsert({
      where: { id: 1 },
      update: updateData,
      create: { id: 1, ...updateData }
    });

    res.json(formatConfig(config));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
