import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import https from 'https';

// For development: Create HTTPS agent that accepts self-signed/expired certificates
// WARNING: Only use in development! Never in production!
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Accept self-signed/expired certificates
});

// Initialize JWKS client
const client = jwksClient({
  jwksUri: process.env.JWT_JWKS_URI || 'https://localhost:9443/oauth2/jwks',
  cache: true,
  cacheMaxAge: 600000, // 10 minutes
  requestHeaders: {}, // Optional headers
  timeout: 30000, // Timeout after 30 seconds
  strictSsl: false, // Disable strict SSL validation
  requestAgent: httpsAgent, // Use custom HTTPS agent for dev
});

/**
 * Get signing key from JWKS endpoint
 */
const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

/**
 * Middleware to authenticate JWT tokens
 * Validates token signature using JWKS endpoint, expiry, issuer, and audience
 */
export const authenticate = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Decode token without verification first to get header info
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token format',
      });
    }

    // For development/testing: Skip signature validation if configured
    if (process.env.JWT_SKIP_VERIFICATION === 'true') {
      console.warn('⚠️  WARNING: JWT signature verification is disabled!');
      req.user = decoded.payload;
      return next();
    }

    // Verify token signature using JWKS
    const verifyOptions = {
      algorithms: ['RS256'], // WSO2 IS uses RS256
    };

    // Add issuer validation if configured
    if (process.env.JWT_ISSUER) {
      verifyOptions.issuer = process.env.JWT_ISSUER;
    }

    // Add audience validation if configured (optional)
    // If not set, audience validation will be skipped
    // Supports multiple audiences (comma-separated client IDs)
    if (process.env.JWT_AUDIENCE) {
      const audiences = process.env.JWT_AUDIENCE.split(',').map((aud) =>
        aud.trim()
      );
      verifyOptions.audience =
        audiences.length === 1 ? audiences[0] : audiences;
    }

    // Verify the token using JWKS
    jwt.verify(token, getKey, verifyOptions, (err, verified) => {
      if (err) {
        console.error('Authentication error:', err.message);

        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            error: 'Unauthorized',
            message: 'Token has expired',
          });
        }

        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid token',
          });
        }

        if (err.name === 'NotBeforeError') {
          return res.status(401).json({
            error: 'Unauthorized',
            message: 'Token not yet valid',
          });
        }

        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication failed',
        });
      }

      // Attach user info to request
      req.user = verified;
      req.token = token;

      next();
    });
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication failed',
    });
  }
};

/**
 * Middleware factory to check if user has required scopes
 * @param {string|string[]} requiredScopes - Required scope(s)
 * @returns {Function} Express middleware function
 */
export const requireScopes = (requiredScopes) => {
  return (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      // Get scopes from token
      const tokenScopes = req.user.scope || req.user.scopes || '';

      // Parse scopes (can be space-separated string or array)
      const userScopes = Array.isArray(tokenScopes)
        ? tokenScopes
        : tokenScopes.split(' ').filter(Boolean);

      // Normalize required scopes to array
      const required = Array.isArray(requiredScopes)
        ? requiredScopes
        : [requiredScopes];

      // Check if user has at least one of the required scopes
      const hasRequiredScope = required.some((scope) =>
        userScopes.includes(scope)
      );

      if (!hasRequiredScope) {
        console.warn(
          `Access denied: User lacks required scopes. Required: ${required.join(
            ', '
          )}, User has: ${userScopes.join(', ')}`
        );
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Insufficient permissions',
          required: required,
          available: userScopes,
        });
      }

      // User has required scope
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Authorization check failed',
      });
    }
  };
};

/**
 * Middleware to check if user has ALL specified scopes
 * @param {string[]} requiredScopes - Required scopes (all must be present)
 * @returns {Function} Express middleware function
 */
export const requireAllScopes = (requiredScopes) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const tokenScopes = req.user.scope || req.user.scopes || '';
      const userScopes = Array.isArray(tokenScopes)
        ? tokenScopes
        : tokenScopes.split(' ').filter(Boolean);

      const required = Array.isArray(requiredScopes)
        ? requiredScopes
        : [requiredScopes];

      // Check if user has ALL required scopes
      const hasAllScopes = required.every((scope) =>
        userScopes.includes(scope)
      );

      if (!hasAllScopes) {
        const missingScopes = required.filter(
          (scope) => !userScopes.includes(scope)
        );
        console.warn(
          `Access denied: Missing scopes: ${missingScopes.join(', ')}`
        );
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Insufficient permissions',
          missing: missingScopes,
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Authorization check failed',
      });
    }
  };
};

/**
 * Optional authentication - attaches user if token is valid but doesn't require it
 * Useful for endpoints that behave differently for authenticated vs anonymous users
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue as anonymous
    return next();
  }

  // Try to authenticate, but don't fail if token is invalid
  authenticate(req, res, (err) => {
    // Continue regardless of authentication result
    next();
  });
};
