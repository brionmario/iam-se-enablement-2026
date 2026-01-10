import express from 'express';
import menuRoutes from './menuRoutes.js';
import orderRoutes from './orderRoutes.js';
import rewardsRoutes from './rewardsRoutes.js';

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Pizza Shack API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/rewards', rewardsRoutes);

export default router;
