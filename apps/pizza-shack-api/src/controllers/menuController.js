import {
  getMenu as getMenuItems,
  findMenuItemById,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../database/menu.js';

/**
 * Get all menu items
 * @route GET /api/v1/menu
 */
export const getMenu = async (req, res, next) => {
  try {
    const { category, available } = req.query;

    const menu = await getMenuItems();
    let filteredMenu = [...menu];

    // Filter by category if provided
    if (category) {
      filteredMenu = filteredMenu.filter(
        (pizza) => pizza.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by availability if provided
    if (available !== undefined) {
      const isAvailable = available === 'true';
      filteredMenu = filteredMenu.filter(
        (pizza) => pizza.available === isAvailable
      );
    }

    res.status(200).json({
      success: true,
      count: filteredMenu.length,
      data: filteredMenu,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single menu item by ID
 * @route GET /api/v1/menu/:id
 */
export const getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pizza = await findMenuItemById(id);

    if (!pizza) {
      const error = new Error(`Pizza with id ${id} not found`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: pizza,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new menu item
 * @route POST /api/v1/menu
 * @scope pizza:create_menu
 */
export const createMenuItem = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      ingredients,
      sizes,
      available,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      const error = new Error(
        'name, description, price, and category are required'
      );
      error.statusCode = 400;
      throw error;
    }

    // Validate price is a positive number
    if (isNaN(price) || price <= 0) {
      const error = new Error('price must be a positive number');
      error.statusCode = 400;
      throw error;
    }

    const newItem = {
      name,
      description,
      price: parseFloat(price),
      category,
      image: image || '/images/pizzas/default.jpeg',
      ingredients: ingredients || [],
      sizes: sizes || ['small', 'medium', 'large'],
      available: available !== undefined ? available : true,
    };

    const createdItem = await addMenuItem(newItem);

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: createdItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a menu item
 * @route PUT /api/v1/menu/:id
 * @scope pizza:update_menu
 */
export const updateMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if item exists
    const existingItem = await findMenuItemById(id);
    if (!existingItem) {
      const error = new Error(`Pizza with id ${id} not found`);
      error.statusCode = 404;
      throw error;
    }

    // Validate price if provided
    if (updates.price !== undefined) {
      if (isNaN(updates.price) || updates.price <= 0) {
        const error = new Error('price must be a positive number');
        error.statusCode = 400;
        throw error;
      }
      updates.price = parseFloat(updates.price);
    }

    const updatedItem = await updateMenuItem(id, updates);

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a menu item
 * @route DELETE /api/v1/menu/:id
 * @scope pizza:delete_menu
 */
export const deleteMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const existingItem = await findMenuItemById(id);
    if (!existingItem) {
      const error = new Error(`Pizza with id ${id} not found`);
      error.statusCode = 404;
      throw error;
    }

    const deleted = await deleteMenuItem(id);

    if (!deleted) {
      const error = new Error('Failed to delete menu item');
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
