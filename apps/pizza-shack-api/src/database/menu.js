import { readData, writeData, initializeData } from './storage.js';

/**
 * File-based storage for menu
 */
const MENU_FILE = 'menu.json';

// Initialize menu data file
await initializeData(MENU_FILE, []);

/**
 * Get all menu items
 */
export const getMenu = async () => {
  return await readData(MENU_FILE, []);
};

/**
 * Save menu items
 */
const saveMenu = async (menu) => {
  await writeData(MENU_FILE, menu);
};

/**
 * Find a menu item by ID
 */
export const findMenuItemById = async (id) => {
  const menu = await getMenu();
  return menu.find((item) => item.id === id);
};

/**
 * Add a new menu item
 */
export const addMenuItem = async (item) => {
  const menu = await getMenu();

  // Generate new ID if not provided
  if (!item.id) {
    const maxId = menu.reduce((max, item) => {
      const numId = parseInt(item.id);
      return numId > max ? numId : max;
    }, 0);
    item.id = String(maxId + 1);
  }

  menu.push(item);
  await saveMenu(menu);
  return item;
};

/**
 * Update a menu item
 */
export const updateMenuItem = async (id, updates) => {
  const menu = await getMenu();
  const index = menu.findIndex((item) => item.id === id);

  if (index !== -1) {
    menu[index] = { ...menu[index], ...updates, id }; // Preserve ID
    await saveMenu(menu);
    return menu[index];
  }

  return null;
};

/**
 * Delete a menu item
 */
export const deleteMenuItem = async (id) => {
  const menu = await getMenu();
  const index = menu.findIndex((item) => item.id === id);

  if (index !== -1) {
    menu.splice(index, 1);
    await saveMenu(menu);
    return true;
  }

  return false;
};

/**
 * Initialize menu with data (used for seeding)
 */
export const initializeMenu = async (menuData) => {
  await saveMenu(menuData);
};
