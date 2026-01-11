import {
  getUnityProfile,
  getAllUnityMembers,
  redeemUnityPoints,
  UNITY_CONFIG,
} from '../services/rewardsService.js';

/**
 * Get Unity Rewards profile for a user
 * @route GET /api/v1/rewards/profile/:userId
 */
export const getRewardsProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const profile = await getUnityProfile(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'User not found in Unity Rewards program',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Redeem points
 * @route POST /api/v1/rewards/redeem
 */
export const redeemPoints = async (req, res, next) => {
  try {
    const { userId, points, reason } = req.body;

    if (!userId || !points || !reason) {
      const error = new Error('userId, points, and reason are required');
      error.statusCode = 400;
      throw error;
    }

    if (points <= 0) {
      const error = new Error('Points must be greater than 0');
      error.statusCode = 400;
      throw error;
    }

    const result = await redeemUnityPoints(userId, points, reason);

    res.status(200).json({
      success: true,
      message: 'Points redeemed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getRewardsProfile,
  redeemPoints,
};
