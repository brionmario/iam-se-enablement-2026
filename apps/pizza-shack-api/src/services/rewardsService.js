/**
 * Unity Rewards - Generic Loyalty Points System
 *
 * A universal rewards program that can be used across multiple applications.
 * Points are earned based on purchase amounts and can be redeemed for rewards.
 *
 * Note: This is a simplified in-memory implementation.
 * In production, use a proper database and consider creating a separate microservice.
 */

// In-memory storage for user rewards (use database in production)
const userRewards = new Map();

/**
 * Unity Rewards Configuration
 */
export const UNITY_CONFIG = {
  // Points earned per dollar spent
  POINTS_PER_DOLLAR: 10,

  // Bonus tiers
  BONUS_TIERS: [
    { minAmount: 50, bonusPercentage: 10 }, // 10% bonus points for orders $50+
    { minAmount: 100, bonusPercentage: 25 }, // 25% bonus points for orders $100+
  ],

  // Welcome bonus for new members
  WELCOME_BONUS: 100,
};

/**
 * Calculate loyalty points for a purchase
 * @param {number} orderTotal - Total order amount
 * @returns {Object} Points calculation breakdown
 */
export const calculateUnityPoints = (orderTotal) => {
  // Base points calculation
  const basePoints = Math.floor(orderTotal * UNITY_CONFIG.POINTS_PER_DOLLAR);

  // Calculate bonus points based on tier
  let bonusPoints = 0;
  let appliedTier = null;

  // Find the highest applicable tier
  for (const tier of UNITY_CONFIG.BONUS_TIERS.reverse()) {
    if (orderTotal >= tier.minAmount) {
      bonusPoints = Math.floor(basePoints * (tier.bonusPercentage / 100));
      appliedTier = tier;
      break;
    }
  }

  const totalPoints = basePoints + bonusPoints;

  return {
    basePoints,
    bonusPoints,
    totalPoints,
    appliedTier: appliedTier
      ? {
          minAmount: appliedTier.minAmount,
          bonusPercentage: appliedTier.bonusPercentage,
        }
      : null,
  };
};

/**
 * Award Unity points to a user
 * @param {string} userId - User identifier (email, phone, or customer ID)
 * @param {number} points - Number of points to award
 * @param {string} orderId - Reference order ID
 * @returns {Object} Updated user rewards profile
 */
export const awardUnityPoints = (userId, points, orderId) => {
  // Get or create user rewards profile
  let userProfile = userRewards.get(userId);

  if (!userProfile) {
    // New user - create profile with welcome bonus
    userProfile = {
      userId,
      totalPoints: UNITY_CONFIG.WELCOME_BONUS,
      lifetimePoints: UNITY_CONFIG.WELCOME_BONUS,
      transactions: [],
      joinedAt: new Date().toISOString(),
      tier: 'Bronze',
      isNewMember: true,
    };

    userProfile.transactions.push({
      type: 'welcome_bonus',
      points: UNITY_CONFIG.WELCOME_BONUS,
      timestamp: new Date().toISOString(),
      description: 'Welcome to Unity Rewards!',
    });
  }

  // Add points
  userProfile.totalPoints += points;
  userProfile.lifetimePoints += points;

  // Record transaction
  userProfile.transactions.push({
    type: 'purchase',
    points,
    orderId,
    timestamp: new Date().toISOString(),
    description: `Order ${orderId}`,
  });

  // Update tier based on lifetime points
  userProfile.tier = calculateTier(userProfile.lifetimePoints);

  // Save updated profile
  userRewards.set(userId, userProfile);

  return {
    userId: userProfile.userId,
    pointsEarned: points,
    totalPoints: userProfile.totalPoints,
    lifetimePoints: userProfile.lifetimePoints,
    tier: userProfile.tier,
    welcomeBonus: userProfile.isNewMember ? UNITY_CONFIG.WELCOME_BONUS : null,
  };
};

/**
 * Calculate membership tier based on lifetime points
 * @param {number} lifetimePoints - Total points earned over time
 * @returns {string} Tier name
 */
const calculateTier = (lifetimePoints) => {
  if (lifetimePoints >= 5000) return 'Platinum';
  if (lifetimePoints >= 2500) return 'Gold';
  if (lifetimePoints >= 1000) return 'Silver';
  return 'Bronze';
};

/**
 * Get user's Unity Rewards profile
 * @param {string} userId - User identifier
 * @returns {Object|null} User rewards profile or null if not found
 */
export const getUnityProfile = (userId) => {
  const profile = userRewards.get(userId);
  if (!profile) return null;

  // Mark as existing member after first retrieval
  if (profile.isNewMember) {
    profile.isNewMember = false;
    userRewards.set(userId, profile);
  }

  return {
    userId: profile.userId,
    totalPoints: profile.totalPoints,
    lifetimePoints: profile.lifetimePoints,
    tier: profile.tier,
    joinedAt: profile.joinedAt,
    recentTransactions: profile.transactions.slice(-10).reverse(),
  };
};

/**
 * Redeem Unity points
 * @param {string} userId - User identifier
 * @param {number} points - Points to redeem
 * @param {string} reason - Redemption reason/description
 * @returns {Object} Updated profile after redemption
 */
export const redeemUnityPoints = (userId, points, reason) => {
  const userProfile = userRewards.get(userId);

  if (!userProfile) {
    throw new Error('User not found in Unity Rewards program');
  }

  if (userProfile.totalPoints < points) {
    throw new Error('Insufficient points for redemption');
  }

  // Deduct points
  userProfile.totalPoints -= points;

  // Record transaction
  userProfile.transactions.push({
    type: 'redemption',
    points: -points,
    timestamp: new Date().toISOString(),
    description: reason,
  });

  userRewards.set(userId, userProfile);

  return {
    userId: userProfile.userId,
    pointsRedeemed: points,
    remainingPoints: userProfile.totalPoints,
    lifetimePoints: userProfile.lifetimePoints,
    tier: userProfile.tier,
  };
};

/**
 * Get all Unity Rewards members (for admin/loyalty app)
 * @returns {Array} List of all members
 */
export const getAllUnityMembers = () => {
  return Array.from(userRewards.values()).map((profile) => ({
    userId: profile.userId,
    totalPoints: profile.totalPoints,
    lifetimePoints: profile.lifetimePoints,
    tier: profile.tier,
    joinedAt: profile.joinedAt,
    transactionCount: profile.transactions.length,
  }));
};

export default {
  calculateUnityPoints,
  awardUnityPoints,
  getUnityProfile,
  redeemUnityPoints,
  getAllUnityMembers,
  UNITY_CONFIG,
};
