import { pizzaMenu } from '../data/pizzas.js';

/**
 * Get all menu items
 * @route GET /api/v1/menu
 */
export const getMenu = (req, res, next) => {
  try {
    const { category, available } = req.query;

    let filteredMenu = [...pizzaMenu];

    // Filter by category if provided
    if (category) {
      filteredMenu = filteredMenu.filter(
        pizza => pizza.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by availability if provided
    if (available !== undefined) {
      const isAvailable = available === 'true';
      filteredMenu = filteredMenu.filter(pizza => pizza.available === isAvailable);
    }

    res.status(200).json({
      success: true,
      count: filteredMenu.length,
      data: filteredMenu
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single menu item by ID
 * @route GET /api/v1/menu/:id
 */
export const getMenuItemById = (req, res, next) => {
  try {
    const { id } = req.params;
    const pizza = pizzaMenu.find(p => p.id === id);

    if (!pizza) {
      const error = new Error(`Pizza with id ${id} not found`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: pizza
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get menu categories
 * @route GET /api/v1/menu/categories
 */
export const getCategories = (req, res, next) => {
  try {
    const categories = [...new Set(pizzaMenu.map(pizza => pizza.category))];

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
