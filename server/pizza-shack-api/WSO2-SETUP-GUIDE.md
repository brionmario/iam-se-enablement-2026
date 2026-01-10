# WSO2 Identity Server Setup Guide

## Authorization Setup

This guide will walk you through creating 3 API resources in WSO2 Identity Server to map the Pizza Shack backend services.

### Prerequisites
- WSO2 Identity Server running on `https://localhost:9443`
- Admin access to WSO2 Identity Server Console

### Reference Documentation
Follow this guide to access the API Resources section: [WSO2 API Authorization Guide](https://is.docs.wso2.com/en/next/guides/authorization/api-authorization/api-authorization/#register-a-business-api)

---

## API Resource 1: Menu Service

### Basic Details
- **Identifier**: `http://localhost:3000/api/v1/menu`
- **Display Name**: `Pizza Shack Menu API`
- **Description**: API for managing Pizza Shack menu items and categories

### Scopes

#### 1. Read Menu
- **Scope**: `pizza:read_menu`
- **Display Name**: `Read Pizza Shack Menu`
- **Description**: `Allows to read the Menu of Pizza Shack`

#### 2. Create Menu
- **Scope**: `pizza:create_menu`
- **Display Name**: `Create Pizza Shack Menu Items`
- **Description**: `Allows to create new menu items in Pizza Shack`

#### 3. Update Menu
- **Scope**: `pizza:update_menu`
- **Display Name**: `Update Pizza Shack Menu Items`
- **Description**: `Allows to update existing menu items in Pizza Shack`

#### 4. Delete Menu
- **Scope**: `pizza:delete_menu`
- **Display Name**: `Delete Pizza Shack Menu Items`
- **Description**: `Allows to delete menu items from Pizza Shack`

---

## API Resource 2: Order Service

### Basic Details
- **Identifier**: `http://localhost:3000/api/v1/orders`
- **Display Name**: `Pizza Shack Order API`
- **Description**: API for managing Pizza Shack orders and order status

### Scopes

#### 1. Read Order
- **Scope**: `pizza:read_order`
- **Display Name**: `Read Pizza Shack Orders`
- **Description**: `Allows to view orders in Pizza Shack`

#### 2. Create Order
- **Scope**: `pizza:create_order`
- **Display Name**: `Create Pizza Shack Orders`
- **Description**: `Allows to create new orders in Pizza Shack`

#### 3. Update Order
- **Scope**: `pizza:update_order`
- **Display Name**: `Update Pizza Shack Orders`
- **Description**: `Allows to update order status in Pizza Shack`

#### 4. Delete Order
- **Scope**: `pizza:delete_order`
- **Display Name**: `Delete Pizza Shack Orders`
- **Description**: `Allows to cancel or delete orders in Pizza Shack`

---

## API Resource 3: Royalty Points Service

### Basic Details
- **Identifier**: `http://localhost:3000/api/v1/unity-rewards`
- **Display Name**: `Unity Rewards Points API`
- **Description**: API for managing Unity Rewards loyalty points and member profiles

### Scopes

#### 1. Read Points
- **Scope**: `pizza:read_points`
- **Display Name**: `Read Unity Rewards Points`
- **Description**: `Allows to view Unity Rewards points and member profiles`

#### 2. Create Points
- **Scope**: `pizza:create_points`
- **Display Name**: `Award Unity Rewards Points`
- **Description**: `Allows to award loyalty points to Unity Rewards members`

#### 3. Update Points
- **Scope**: `pizza:update_points`
- **Display Name**: `Update Unity Rewards Points`
- **Description**: `Allows to redeem or modify Unity Rewards points`

#### 4. Delete Points
- **Scope**: `pizza:delete_points`
- **Display Name**: `Delete Unity Rewards Points`
- **Description**: `Allows to remove or reset Unity Rewards points`

---

## Step-by-Step Instructions

### 1. Access API Resources Section
1. Log in to WSO2 Identity Server Console at `https://localhost:9443/console`
2. Navigate to **Applications** → **API Resources**
3. Click **+ New API Resource**

### 2. Create Each API Resource
Repeat these steps for each of the 3 API resources listed above:

#### Step 2.1: Enter Basic Details
1. Enter the **Identifier** (e.g., `http://localhost:3000/api/v1/menu`)
2. Enter the **Display Name** (e.g., `Pizza Shack Menu API`)
3. Enter the **Description**
4. Click **Next** or **Continue**

#### Step 2.2: Add Scopes
1. For each scope listed under the API resource:
   - Click **+ Add Scope**
   - Enter the **Scope** identifier (e.g., `pizza:read_menu`)
   - Enter the **Display Name** (e.g., `Read Pizza Shack Menu`)
   - Enter the **Description** (e.g., `Allows to read the Menu of Pizza Shack`)
   - Click **Add** or **Save**
2. Repeat for all scopes in that API resource
3. Click **Finish** or **Create**

### 3. Configure Application Access

After creating all API resources, you need to authorize your applications to use these scopes:

#### For Pizza Shack Application
1. Go to **Applications** → Select your Pizza Shack application
2. Navigate to **API Authorization** tab
3. Click **+ Authorize an API Resource**
4. Select the API resources and grant the following scopes:
   - `pizza:read_menu` (to view menu)
   - `pizza:create_order` (to place orders)
   - `pizza:read_order` (to view order history)
   - `pizza:read_points` (to view rewards)

#### For Unity Rewards Application
1. Go to **Applications** → Select your Unity Rewards application
2. Navigate to **API Authorization** tab
3. Click **+ Authorize an API Resource**
4. Select the API resources and grant the following scopes:
   - `pizza:read_points` (to view rewards and member profiles)
   - `pizza:update_points` (to redeem points)

---

## Verification

### Test Scope Assignment
1. Generate an access token for your application
2. Decode the JWT token at [jwt.io](https://jwt.io)
3. Verify the `scope` claim contains the authorized scopes
4. Example:
   ```json
   {
     "scope": "pizza:read_menu pizza:create_order pizza:read_points"
   }
   ```

### Test API Access
1. Use the access token to call the protected APIs:
   ```bash
   curl -X GET http://localhost:3000/api/v1/menu \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```
2. Verify you get a successful response (200 OK)
3. Try accessing an endpoint without proper scopes to verify 403 Forbidden response

---

## Common Scope Assignments

### Customer User
Typical scopes for a regular customer:
- `pizza:read_menu` - Browse menu
- `pizza:create_order` - Place orders
- `pizza:read_order` - View own orders
- `pizza:read_points` - View own rewards

### Admin User
Additional scopes for administrators:
- `pizza:create_menu` - Add new menu items
- `pizza:update_menu` - Modify menu items
- `pizza:delete_menu` - Remove menu items
- `pizza:update_order` - Update order status
- `pizza:delete_order` - Cancel orders
- `pizza:update_points` - Adjust customer points
- `pizza:create_points` - Award bonus points

---

## Troubleshooting

### Scope Not Appearing in Token
- Verify the API resource is created correctly
- Check that the scope is authorized for your application
- Ensure the user has permissions to request the scope
- Try regenerating the access token

### 403 Forbidden Error
- Check the token's `scope` claim includes the required scope
- Verify the scope name matches exactly (case-sensitive)
- Ensure JWT_SKIP_VERIFICATION is set correctly for your environment

### JWKS Certificate Error
- For development with self-signed certificates, ensure `strictSsl: false` in auth middleware
- For production, use valid SSL certificates

---

## Next Steps

1. Create user roles and groups
2. Assign scopes to roles
3. Implement role-based access control (RBAC)
4. Set up token refresh mechanism
5. Configure token expiry times
6. Enable audit logging for sensitive operations

## Additional Resources

- [WSO2 IS API Authorization Documentation](https://is.docs.wso2.com/en/next/guides/authorization/api-authorization/)
- [OAuth 2.0 Scopes Best Practices](https://oauth.net/2/scope/)
- [JWT Token Validation](https://jwt.io/introduction)
