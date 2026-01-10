import {
  getUnityProfile,
  getAllUnityMembers,
  redeemUnityPoints,
  UNITY_CONFIG,
} from '../services/rewardsService.js';

/**
 * Get Unity Rewards profile for a user
 * @route GET /api/v1/unity-rewards/profile/:userId
 */
export const getRewardsProfile = (req, res, next) => {
  try {
    const { userId } = req.params;

    const profile = getUnityProfile(userId);

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
 * Get all Unity Rewards members (Admin only)
 * @route GET /api/v1/unity-rewards/members
 */
export const getAllMembers = (req, res, next) => {
  try {
    const members = getAllUnityMembers();

    res.status(200).json({
      success: true,
      data: {
        totalMembers: members.length,
        members,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Redeem points
 * @route POST /api/v1/unity-rewards/redeem
 */
export const redeemPoints = (req, res, next) => {
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

    const result = redeemUnityPoints(userId, points, reason);

    res.status(200).json({
      success: true,
      message: 'Points redeemed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Unity Rewards configuration and info
 * @route GET /api/v1/unity-rewards/info
 */
export const getRewardsInfo = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        programName: 'Unity Rewards',
        description:
          'Universal loyalty program - earn points on every purchase',
        pointsPerDollar: UNITY_CONFIG.POINTS_PER_DOLLAR,
        welcomeBonus: UNITY_CONFIG.WELCOME_BONUS,
        bonusTiers: UNITY_CONFIG.BONUS_TIERS,
        membershipTiers: [
          { name: 'Bronze', minLifetimePoints: 0 },
          { name: 'Silver', minLifetimePoints: 1000 },
          { name: 'Gold', minLifetimePoints: 2500 },
          { name: 'Platinum', minLifetimePoints: 5000 },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getRewardsProfile,
  getAllMembers,
  redeemPoints,
  getRewardsInfo,
};
