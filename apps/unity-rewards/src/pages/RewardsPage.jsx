import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, useAsgardeo } from '@asgardeo/react';
import { getRewards } from '../api/getRewards';
import Preloader from '../components/Preloader';

export default function RewardsPage() {
  const { user } = useAsgardeo();
  const [rewardsData, setRewardsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadRewards();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadRewards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userId = user.sub || user.id || user.userName;
      const response = await getRewards(userId);
      setRewardsData(response.data);
    } catch (err) {
      console.error('Failed to load rewards:', err);
      setError('Failed to load rewards data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-content-container">
      {/* Signed In View */}
      <SignedIn>
        {isLoading ? (
          <div className="loading-state">
            <Preloader />
            <p className="loading-text">Loading your rewards...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2 className="error-heading">Oops! Something went wrong</h2>
            <p className="error-subtext">{error}</p>
            <button className="try-again-btn" onClick={loadRewards}>
              Try Again
            </button>
          </div>
        ) : (
          <div className="rewards-content">
            {/* Header Section */}
            <div className="rewards-header-section">
              <h1 className="rewards-page-title">Your Unity Rewards</h1>
              <p className="rewards-subtitle">
                Welcome back, {user?.userName}! Track your points and rewards
                here.
              </p>
            </div>

            {/* Points Summary Card */}
            <div className="rewards-summary-card">
              <div className="points-display">
                <div className="points-icon">🏆</div>
                <div className="points-info">
                  <h2 className="points-label">Total Points</h2>
                  <p className="points-value">
                    {rewardsData?.totalPoints || 0}
                  </p>
                  <p className="points-tier">{rewardsData?.tier} Member</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rewards-section">
              <h2 className="section-title">Recent Activity</h2>
              {rewardsData?.recentTransactions?.length > 0 ? (
                <div className="activity-list">
                  {rewardsData.recentTransactions.map((transaction, index) => {
                    const isEarn =
                      transaction.type === 'purchase' ||
                      transaction.type === 'welcome_bonus';
                    const displayType = isEarn ? 'earn' : 'redeem';
                    return (
                      <div key={index} className="activity-item">
                        <div className="activity-icon">
                          {isEarn ? '➕' : '➖'}
                        </div>
                        <div className="activity-details">
                          <p className="activity-description">
                            {transaction.description}
                          </p>
                          <p className="activity-date">
                            {new Date(transaction.timestamp).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                          </p>
                        </div>
                        <div className={`activity-points ${displayType}`}>
                          {isEarn ? '+' : '-'}
                          {Math.abs(transaction.points)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h3 className="empty-heading">No activity yet</h3>
                  <p className="empty-subtext">
                    Start earning points by making purchases!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </SignedIn>

      {/* Signed Out View */}
      <SignedOut>
        <div className="signed-out-state">
          <div className="hero-section">
            <h1 className="hero-title">Welcome to Unity Rewards</h1>
            <p className="hero-subtitle">
              Sign in to start earning and redeeming rewards!
            </p>
            <div className="hero-features">
              <div className="feature-card">
                <div className="feature-icon">🎁</div>
                <h3 className="feature-title">Earn Points</h3>
                <p className="feature-description">
                  Get points with every purchase
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🏆</div>
                <h3 className="feature-title">Exclusive Rewards</h3>
                <p className="feature-description">
                  Redeem points for amazing rewards
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⭐</div>
                <h3 className="feature-title">Special Offers</h3>
                <p className="feature-description">Access member-only deals</p>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
    </main>
  );
}
