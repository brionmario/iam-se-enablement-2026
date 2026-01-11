import { createContext } from 'react';

const FeatureGateContext = createContext({
  roles: [],
  hasFeature: () => false,
  hasAnyRole: () => false,
  hasAllRoles: () => false,
});

export default FeatureGateContext;
