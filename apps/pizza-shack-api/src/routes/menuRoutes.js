import express from 'express';
import {
  getMenu,
  getMenuItemById,
  createMenuItem,
  updateMenuItemById,
  deleteMenuItemById,
} from '../controllers/menuController.js';
import { authenticate, requireScopes } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/v1/menu
 * @desc    Get all menu items
 * @query   category - Filter by category
 * @query   available - Filter by availability (true/false)
 * @access  Public
 */
router.get('/', getMenu);

/**
 * @route   GET /api/v1/menu/:id
 * @desc    Get single menu item by ID
 * @access  Public
 */
router.get('/:id', getMenuItemById);

/**
 * @route   POST /api/v1/menu
 * @desc    Create a new menu item
 * @access  Protected - Requires pizza:create_menu scope
 */
router.post(
  '/',
  authenticate,
  requireScopes(['pizza:create_menu']),
  createMenuItem
);

/**
 * @route   PUT /api/v1/menu/:id
 * @desc    Update a menu item
 * @access  Protected - Requires pizza:update_menu scope
 */
router.put(
  '/:id',
  authenticate,
  requireScopes(['pizza:update_menu']),
  updateMenuItemById
);

/**
 * @route   DELETE /api/v1/menu/:id
 * @desc    Delete a menu item
 * @access  Protected - Requires pizza:delete_menu scope
 */
router.delete(
  '/:id',
  authenticate,
  requireScopes(['pizza:delete_menu']),
  deleteMenuItemById
);

export default router;
