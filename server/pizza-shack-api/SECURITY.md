# API Security Implementation

## Overview

The Pizza Shack API has been secured with JWT-based authentication and scope-based authorization.

## Security Features

### 1. JWT Authentication
- All API endpoints require a valid JWT token in the `Authorization` header
- Token format: `Bearer <jwt_token>`
- Token validation includes:
  - Signature verification (RS256/HS256)
  - Expiry check (exp claim)
  - Issuer validation (iss claim)
  - Audience validation (aud claim)

### 2. Scope-Based Authorization
Each API endpoint requires specific scopes:

#### Menu Service
- `pizza:read_menu` - Read menu items and categories
- `pizza:create_menu` - Create new menu items
- `pizza:update_menu` - Update existing menu items
- `pizza:delete_menu` - Delete menu items

#### Order Service
- `pizza:read_order` - View orders
- `pizza:create_order` - Create new orders
- `pizza:update_order` - Update order status
- `pizza:delete_order` - Cancel/delete orders

#### Royalty Points Service
- `pizza:read_points` - View rewards and points
- `pizza:create_points` - Award points
- `pizza:update_points` - Redeem or modify points
- `pizza:delete_points` - Remove points

## Configuration

### Environment Variables

Configure JWT settings in your `.env` file:

```env
# Development mode - Skip JWT signature verification
JWT_SKIP_VERIFICATION=true

# Production mode - Verify JWT signatures
JWT_SKIP_VERIFICATION=false
JWT_SECRET=your-secret-key-for-hmac
# OR use JWKS for RSA (recommended for production)
JWT_JWKS_URI=https://your-identity-server/oauth2/jwks

# Token validation
JWT_ISSUER=https://localhost:9443/oauth2/token
JWT_AUDIENCE=your-client-id
```

### Development Mode

For development and testing, you can skip JWT signature verification:

```env
JWT_SKIP_VERIFICATION=true
```

⚠️ **WARNING**: Never use this in production!

### Production Mode

For production, always verify JWT signatures:

**Option 1: Using JWKS (Recommended for WSO2 IS)**
```env
JWT_SKIP_VERIFICATION=false
JWT_JWKS_URI=https://your-wso2-is:9443/oauth2/jwks
JWT_ISSUER=https://your-wso2-is:9443/oauth2/token
JWT_AUDIENCE=your-client-id
```

**Option 2: Using Shared Secret (HMAC)**
```env
JWT_SKIP_VERIFICATION=false
JWT_SECRET=your-secret-key
JWT_ISSUER=https://your-wso2-is:9443/oauth2/token
JWT_AUDIENCE=your-client-id
```

## Testing the API

### 1. Get an Access Token

Obtain a JWT token from your identity provider (e.g., WSO2 Identity Server) with the required scopes.

Example token structure:
```json
{
  "sub": "user-id",
  "scope": "pizza:read_menu pizza:create_order pizza:read_points",
  "iss": "https://localhost:9443/oauth2/token",
  "aud": "your-client-id",
  "exp": 1234567890
}
```

### 2. Make API Requests

Include the token in the Authorization header:

```bash
curl -X GET http://localhost:3000/api/v1/menu \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Example Requests

#### Get Menu (requires pizza:read_menu)
```bash
curl -X GET http://localhost:3000/api/v1/menu \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Create Order (requires pizza:create_order)
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"pizzaId": "margherita", "quantity": 2, "size": "large"}
    ]
  }'
```

#### Get Rewards (requires pizza:read_points)
```bash
curl -X GET http://localhost:3000/api/v1/unity-rewards \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Error Responses

### 401 Unauthorized
Token is missing, invalid, or expired:
```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid Authorization header"
}
```

### 403 Forbidden
Token is valid but lacks required scopes:
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions",
  "required": ["pizza:create_order"],
  "available": ["pizza:read_menu", "pizza:read_points"]
}
```

## Middleware Architecture

### Authentication Flow
1. Extract token from `Authorization` header
2. Decode and validate token structure
3. Verify token signature (if not in dev mode)
4. Check token expiry
5. Validate issuer and audience
6. Attach user info to `req.user`

### Authorization Flow
1. Check if user is authenticated
2. Extract scopes from token (`scope` or `scopes` claim)
3. Verify user has required scope(s)
4. Allow or deny access

## Security Best Practices

1. **Always use HTTPS in production**
2. **Never commit JWT secrets to version control**
3. **Use short token expiry times** (e.g., 15-60 minutes)
4. **Implement token refresh mechanism**
5. **Rotate secrets regularly**
6. **Monitor for suspicious activity**
7. **Use JWKS for RSA verification** when possible
8. **Validate all token claims** (iss, aud, exp, nbf)

## Troubleshooting

### Token Validation Fails
- Check token expiry (`exp` claim)
- Verify issuer matches `JWT_ISSUER`
- Verify audience matches `JWT_AUDIENCE`
- Ensure JWT_SECRET or JWT_JWKS_URI is correctly configured

### Scope Authorization Fails
- Check token's `scope` claim contains required scope
- Scopes are case-sensitive
- Multiple scopes should be space-separated in the token

### Cannot Access Any Endpoint
- Verify server is running
- Check `.env` file exists and is loaded
- If using `JWT_SKIP_VERIFICATION=false`, ensure JWT_SECRET or JWT_JWKS_URI is set
- Check Authorization header format: `Bearer <token>`

## Additional Resources

- [JWT.io](https://jwt.io) - Decode and inspect JWT tokens
- [WSO2 Identity Server Documentation](https://is.docs.wso2.com/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
