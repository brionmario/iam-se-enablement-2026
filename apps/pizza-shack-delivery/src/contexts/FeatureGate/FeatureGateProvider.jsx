import { useState, useEffect, useMemo } from 'react';
import { useAsgardeo } from '@asgardeo/react';
import FeatureGateContext from './FeatureGateContext';

// Feature definitions with role requirements
const FEATURES = {
  // Order read features
  'orders.view': ['delivery_rider', 'delivery_dispatcher', 'delivery_admin'],
  'orders.viewAll': ['delivery_dispatcher', 'delivery_admin'],
  'orders.viewAssigned': ['delivery_rider'],

  // Order write features
  'orders.create': ['delivery_admin'],
  'orders.update': ['delivery_dispatcher', 'delivery_admin'],
  'orders.updateStatus': [
    'delivery_rider',
    'delivery_dispatcher',
    'delivery_admin',
  ],
  'orders.markDelivered': [
    'delivery_rider',
    'delivery_dispatcher',
    'delivery_admin',
  ],
  'orders.delete': ['delivery_dispatcher', 'delivery_admin'],
  'orders.reassign': ['delivery_dispatcher', 'delivery_admin'],

  // Menu features - Only delivery_admin can manage menu
  'menu.view': ['delivery_admin'],
  'menu.create': ['delivery_admin'],
  'menu.update': ['delivery_admin'],
  'menu.delete': ['delivery_admin'],

  // Admin features
  'admin.panel': ['delivery_admin'],
  'admin.users': ['delivery_admin'],
  'admin.settings': ['delivery_admin'],

  // Analytics features
  'analytics.view': ['delivery_dispatcher', 'delivery_admin'],
  'analytics.export': ['delivery_admin'],
};

export default function FeatureGateProvider({ children }) {
  const { getDecodedIdToken, isSignedIn, isLoading } = useAsgardeo();
  const [roles, setRoles] = useState([]);

  // Get roles from ID token
  useEffect(() => {
    if (!isSignedIn || isLoading) {
      setRoles([]);
      return;
    }

    (async () => {
      try {
        const idToken = await getDecodedIdToken();
        const userRoles = idToken?.roles || [];

        // Normalize roles to always be an array
        // Handle case where roles might be a single string
        const normalizedRoles = Array.isArray(userRoles)
          ? userRoles
          : [userRoles];

        setRoles(normalizedRoles);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setRoles([]);
      }
    })();
  }, [getDecodedIdToken, isSignedIn, isLoading]);

  const contextValue = useMemo(() => {
    /**
     * Check if user has access to a specific feature
     * @param {string} featureKey - The feature key to check
     * @returns {boolean} - True if user has access to the feature
     */
    const hasFeature = (featureKey) => {
      // If user is not signed in, deny access
      if (!isSignedIn || roles.length === 0) {
        return false;
      }

      // Get allowed roles for this feature
      const allowedRoles = FEATURES[featureKey];

      // If feature doesn't exist in config, deny access
      if (!allowedRoles || !Array.isArray(allowedRoles)) {
        console.warn(`Feature "${featureKey}" not defined in FEATURES config`);
        return false;
      }

      // Check if user has any of the allowed roles
      return roles.some((role) => allowedRoles.includes(role));
    };

    /**
     * Check if user has any of the specified roles
     * @param {string[]} requiredRoles - Array of role names
     * @returns {boolean} - True if user has at least one of the roles
     */
    const hasAnyRole = (requiredRoles) => {
      if (!isSignedIn || roles.length === 0) {
        return false;
      }
      return roles.some((role) => requiredRoles.includes(role));
    };

    /**
     * Check if user has all of the specified roles
     * @param {string[]} requiredRoles - Array of role names
     * @returns {boolean} - True if user has all the roles
     */
    const hasAllRoles = (requiredRoles) => {
      if (!isSignedIn || roles.length === 0) {
        return false;
      }
      return requiredRoles.every((role) => roles.includes(role));
    };

    return {
      roles,
      hasFeature,
      hasAnyRole,
      hasAllRoles,
    };
  }, [roles, isSignedIn]);

  return (
    <FeatureGateContext.Provider value={contextValue}>
      {children}
    </FeatureGateContext.Provider>
  );
}
