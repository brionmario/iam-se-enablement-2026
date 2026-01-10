import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import { validate } from '../middleware/validation.js';
import { authenticate, requireScopes } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/v1/orders
 * @desc    Create a new order
 * @access  Protected - Requires pizza:create_order scope
 */
router.post(
  '/',
  authenticate,
  requireScopes('pizza:create_order'),
  [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Items must be a non-empty array'),
    body('items.*.pizzaId').notEmpty().withMessage('Pizza ID is required'),
    body('items.*.quantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    body('items.*.size')
      .optional()
      .isIn(['small', 'medium', 'large'])
      .withMessage('Size must be small, medium, or large'),
    validate,
  ],
  createOrder
);

/**
 * @route   GET /api/v1/orders
 * @desc    Get all orders
 * @query   status - Filter by status
 * @query   limit - Limit results (default: 50)
 * @query   offset - Offset for pagination (default: 0)
 * @access  Protected - Requires pizza:read_order scope
 */
router.get('/', authenticate, requireScopes('pizza:read_order'), getAllOrders);

/**
 * @route   GET /api/v1/orders/:orderId
 * @desc    Get order by ID
 * @access  Protected - Requires pizza:read_order scope
 */
router.get(
  '/:orderId',
  authenticate,
  requireScopes('pizza:read_order'),
  getOrderById
);

/**
 * @route   PATCH /api/v1/orders/:orderId/status
 * @desc    Update order status
 * @access  Protected - Requires pizza:update_order scope
 */
router.patch(
  '/:orderId/status',
  authenticate,
  requireScopes('pizza:update_order'),
  [body('status').notEmpty().withMessage('Status is required'), validate],
  updateOrderStatus
);

/**
 * @route   DELETE /api/v1/orders/:orderId
 * @desc    Delete order
 * @access  Protected - Requires pizza:delete_order scope
 */
router.delete(
  '/:orderId',
  authenticate,
  requireScopes('pizza:delete_order'),
  deleteOrder
);

export default router;
