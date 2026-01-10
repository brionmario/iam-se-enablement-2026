import express from 'express';
import {
  getMenu,
  getMenuItemById,
  getCategories,
} from '../controllers/menuController.js';
import { authenticate, requireScopes } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/v1/menu
 * @desc    Get all menu items
 * @query   category - Filter by category
 * @query   available - Filter by availability (true/false)
 * @access  Protected - Requires pizza:read_menu scope
 */
router.get('/', authenticate, requireScopes('pizza:read_menu'), getMenu);

/**
 * @route   GET /api/v1/menu/categories
 * @desc    Get all menu categories
 * @access  Protected - Requires pizza:read_menu scope
 */
router.get(
  '/categories',
  authenticate,
  requireScopes('pizza:read_menu'),
  getCategories
);

/**
 * @route   GET /api/v1/menu/:id
 * @desc    Get single menu item by ID
 * @access  Protected - Requires pizza:read_menu scope
 */
router.get(
  '/:id',
  authenticate,
  requireScopes('pizza:read_menu'),
  getMenuItemById
);

export default router;
