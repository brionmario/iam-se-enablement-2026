import { orders, generateOrderId } from '../data/orders.js';
import { pizzaMenu } from '../data/pizzas.js';
import {
  calculateUnityPoints,
  awardUnityPoints,
} from '../services/rewardsService.js';

/**
 * Create a new order
 * @route POST /api/v1/orders
 */
export const createOrder = (req, res, next) => {
  try {
    const { items, customerInfo, deliveryAddress } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      const error = new Error('Order must contain at least one item');
      error.statusCode = 400;
      throw error;
    }

    // Validate each item exists in menu
    const orderItems = items.map((item) => {
      const pizza = pizzaMenu.find((p) => p.id === item.pizzaId);
      if (!pizza) {
        const error = new Error(`Pizza with id ${item.pizzaId} not found`);
        error.statusCode = 404;
        throw error;
      }

      return {
        pizzaId: item.pizzaId,
        name: pizza.name,
        quantity: item.quantity || 1,
        size: item.size || 'medium',
        price: pizza.price,
        subtotal: pizza.price * (item.quantity || 1),
      };
    });

    // Calculate total
    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    // Create order
    const order = {
      orderId: generateOrderId(),
      items: orderItems,
      customerInfo: customerInfo || {},
      deliveryAddress: deliveryAddress || {},
      total: parseFloat(total.toFixed(2)),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(order);

    // Calculate and award Unity Rewards points
    const pointsCalculation = calculateUnityPoints(order.total);

    // Use customer ID or username as userId (fallback to email, phone, or orderId for guests)
    const userId =
      customerInfo?.id ||
      customerInfo?.username ||
      customerInfo?.email ||
      customerInfo?.phone ||
      order.orderId;
    const rewardsResult = awardUnityPoints(
      userId,
      pointsCalculation.totalPoints,
      order.orderId
    );

    // Add Unity Rewards info to order
    order.unityRewards = {
      userId,
      pointsEarned: rewardsResult.pointsEarned,
      totalPoints: rewardsResult.totalPoints,
      lifetimePoints: rewardsResult.lifetimePoints,
      tier: rewardsResult.tier,
      welcomeBonus: rewardsResult.welcomeBonus,
      calculation: pointsCalculation,
    };

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders
 * @route GET /api/v1/orders
 */
export const getAllOrders = (req, res, next) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let filteredOrders = [...orders];

    // Filter by status if provided
    if (status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Sort by creation date (newest first)
    filteredOrders.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Apply pagination
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    const paginatedOrders = filteredOrders.slice(
      offsetNum,
      offsetNum + limitNum
    );

    res.status(200).json({
      success: true,
      count: paginatedOrders.length,
      total: filteredOrders.length,
      data: paginatedOrders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by ID
 * @route GET /api/v1/orders/:orderId
 */
export const getOrderById = (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = orders.find((o) => o.orderId === orderId);

    if (!order) {
      const error = new Error(`Order with id ${orderId} not found`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status
 * @route PATCH /api/v1/orders/:orderId/status
 */
export const updateOrderStatus = (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'delivering',
      'delivered',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      const error = new Error(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      );
      error.statusCode = 400;
      throw error;
    }

    const order = orders.find((o) => o.orderId === orderId);

    if (!order) {
      const error = new Error(`Order with id ${orderId} not found`);
      error.statusCode = 404;
      throw error;
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete order
 * @route DELETE /api/v1/orders/:orderId
 */
export const deleteOrder = (req, res, next) => {
  try {
    const { orderId } = req.params;
    const orderIndex = orders.findIndex((o) => o.orderId === orderId);

    if (orderIndex === -1) {
      const error = new Error(`Order with id ${orderId} not found`);
      error.statusCode = 404;
      throw error;
    }

    orders.splice(orderIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
