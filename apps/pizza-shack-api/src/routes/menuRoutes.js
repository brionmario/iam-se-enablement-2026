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
 * @access  Public
 */
router.get('/', getMenu);

/**
 * @route   GET /api/v1/menu/categories
 * @desc    Get all menu categories
 * @access  Public
 */
router.get('/categories', getCategories);

/**
 * @route   GET /api/v1/menu/:id
 * @desc    Get single menu item by ID
 * @access  Public
 */
router.get('/:id', getMenuItemById);

export default router;
