import { readData, writeData, initializeData } from './storage.js';

/**
 * File-based storage for orders
 */
const ORDERS_FILE = 'orders.json';
const ORDER_COUNTER_FILE = 'order_counter.json';

// Initialize data files
await initializeData(ORDERS_FILE, []);
await initializeData(ORDER_COUNTER_FILE, { counter: 1 });

/**
 * Get all orders
 */
export const getOrders = async () => {
  return await readData(ORDERS_FILE, []);
};

/**
 * Save orders
 */
const saveOrders = async (orders) => {
  await writeData(ORDERS_FILE, orders);
};

/**
 * Add a new order
 */
export const addOrder = async (order) => {
  const orders = await getOrders();
  orders.push(order);
  await saveOrders(orders);
  return order;
};

/**
 * Find an order by ID
 */
export const findOrderById = async (orderId) => {
  const orders = await getOrders();
  return orders.find((o) => o.orderId === orderId);
};

/**
 * Update an order
 */
export const updateOrder = async (orderId, updates) => {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.orderId === orderId);
  if (index !== -1) {
    orders[index] = { ...orders[index], ...updates };
    await saveOrders(orders);
    return orders[index];
  }
  return null;
};

/**
 * Delete an order
 */
export const deleteOrderById = async (orderId) => {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.orderId === orderId);
  if (index !== -1) {
    orders.splice(index, 1);
    await saveOrders(orders);
    return true;
  }
  return false;
};

/**
 * Generate a new order ID
 */
export const generateOrderId = async () => {
  const counterData = await readData(ORDER_COUNTER_FILE, { counter: 1 });
  const orderId = `ORD-${String(counterData.counter).padStart(6, '0')}`;
  counterData.counter++;
  await writeData(ORDER_COUNTER_FILE, counterData);
  return orderId;
};
