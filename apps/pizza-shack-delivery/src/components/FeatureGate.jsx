import useFeatureGate from '../contexts/FeatureGate/useFeatureGate';

/**
 * Component to conditionally render children based on feature access
 * @param {Object} props
 * @param {string} props.feature - Feature key to check
 * @param {React.ReactNode} props.children - Content to render if feature is enabled
 * @param {React.ReactNode} props.fallback - Optional content to render if feature is disabled
 */
export default function FeatureGate({ feature, children, fallback = null }) {
  const { hasFeature } = useFeatureGate();

  if (!hasFeature(feature)) {
    return fallback;
  }

  return children;
}
