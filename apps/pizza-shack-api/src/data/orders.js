/**
 * In-memory storage for orders (in production, use a database)
 */
export const orders = [];

let orderIdCounter = 1;

/**
 * Generate a new order ID
 */
export const generateOrderId = () => {
  return `ORD-${String(orderIdCounter++).padStart(6, '0')}`;
};
