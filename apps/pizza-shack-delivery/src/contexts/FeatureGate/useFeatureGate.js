import { useContext } from 'react';
import FeatureGateContext from './FeatureGateContext';

/**
 * Hook to access feature gate functionality
 * @returns {Object} Feature gate context
 */
export default function useFeatureGate() {
  const context = useContext(FeatureGateContext);

  if (!context) {
    throw new Error('useFeatureGate must be used within a FeatureGateProvider');
  }

  return context;
}
