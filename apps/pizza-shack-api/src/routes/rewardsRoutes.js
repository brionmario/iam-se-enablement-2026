import express from 'express';
import { body } from 'express-validator';
import {
  getRewardsProfile,
  redeemPoints,
} from '../controllers/rewardsController.js';
import { validate } from '../middleware/validation.js';
import { authenticate, requireScopes } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/v1/rewards
 * @desc    Get current user's Unity Rewards data
 * @access  Protected - Requires pizza:read_points scope
 */
router.get(
  '/',
  authenticate,
  requireScopes('pizza:read_points'),
  getRewardsProfile
);

/**
 * @route   GET /api/v1/rewards/profile/:userId
 * @desc    Get user's Unity Rewards profile
 * @access  Protected - Requires pizza:read_points scope
 */
router.get(
  '/profile/:userId',
  authenticate,
  requireScopes('pizza:read_points'),
  getRewardsProfile
);

/**
 * @route   POST /api/v1/rewards/redeem
 * @desc    Redeem Unity points
 * @access  Protected - Requires pizza:update_points scope
 */
router.post(
  '/redeem',
  authenticate,
  requireScopes('pizza:update_points'),
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('points').isInt({ min: 1 }).withMessage('Points must be at least 1'),
    body('reason').notEmpty().withMessage('Redemption reason is required'),
    validate,
  ],
  redeemPoints
);

export default router;
