import { readData, writeData } from './storage.js';
import { initializeMenu } from './menu.js';

/**
 * Database seeding utility
 * Seeds initial menu data for the Pizza Shack
 */

const ORDERS_FILE = 'orders.json';
const ORDER_COUNTER_FILE = 'order_counter.json';
const REWARDS_FILE = 'user_rewards.json';
const MENU_FILE = 'menu.json';
const SEED_FLAG_FILE = 'seeded.json';

/**
 * Pizza menu data
 */
const INITIAL_MENU = [
  {
    id: '1',
    name: 'Margherita Classic',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 12.99,
    category: 'vegetarian',
    image: '/images/pizzas/margherita_classic.jpeg',
    ingredients: ['Tomato Sauce', 'Mozzarella', 'Basil', 'Olive Oil'],
    sizes: ['small', 'medium', 'large'],
    available: true,
  },
  {
    id: '2',
    name: 'Tandoori Chicken',
    description:
      'Tender tandoori chicken, crisp bell peppers, onions, spiced tomato sauce',
    price: 14.99,
    category: 'meat',
    image: '/images/pizzas/tandoori_chicken.jpeg',
    ingredients: [
      'Tandoori Sauce',
      'Chicken',
      'Bell Peppers',
      'Onions',
      'Mozzarella',
    ],
    sizes: ['small', 'medium', 'large'],
    available: true,
  },
  {
    id: '3',
    name: 'Spicy Jaffna Crab',
    description:
      'Rich Jaffna-style crab curry, mozzarella, onions, fiery spice. An exotic coastal delight!',
    price: 16.5,
    category: 'seafood',
    image: '/images/pizzas/spicy_jaffna_crab.jpeg',
    ingredients: ['Jaffna Curry', 'Crab', 'Onions', 'Mozzarella', 'Chili'],
    sizes: ['small', 'medium', 'large'],
    available: true,
  },
  {
    id: '4',
    name: 'Four Cheese Fusion',
    description:
      'Four cheese blend with mozzarella, cheddar, parmesan, and cream cheese',
    price: 15.99,
    category: 'vegetarian',
    image: '/images/pizzas/four_cheese_fusion.jpeg',
    ingredients: ['Mozzarella', 'Cheddar', 'Parmesan', 'Cream Cheese'],
    sizes: ['small', 'medium', 'large'],
    available: true,
  },
  {
    id: '5',
    name: 'Curry Chicken & Cashew',
    description:
      'Savory curry chicken with roasted cashews, onions, and aromatic spices',
    price: 15.99,
    category: 'meat',
    image: '/images/pizzas/curry_chicken_cashew.jpeg',
    ingredients: ['Curry Sauce', 'Chicken', 'Cashews', 'Onions', 'Mozzarella'],
    sizes: ['small', 'medium', 'large'],
    available: true,
  },
  {
    id: '6',
    name: 'Hot Butter Prawn',
    description:
      'Succulent prawns in spicy butter sauce with onions and peppers',
    price: 17.99,
    category: 'seafood',
    image: '/images/pizzas/hot_butter_prawn.jpeg',
    ingredients: [
      'Butter Sauce',
      'Prawns',
      'Onions',
      'Peppers',
      'Mozzarella',
      'Chili',
    ],
    sizes: ['small', 'medium', 'large'],
    available: true,
  },
  {
    id: '7',
    name: 'Spicy Paneer Veggie',
    description: 'Spiced paneer cheese with mixed vegetables and tangy sauce',
    price: 14.99,
    category: 'vegetarian',
    image: '/images/pizzas/spicy_paneer_veggie.jpeg',
    ingredients: [
      'Paneer',
      'Bell Peppers',
      'Onions',
      'Tomato Sauce',
      'Mozzarella',
      'Spices',
    ],
    sizes: ['small', 'medium', 'large'],
    available: true,
  },
  {
    id: '8',
    name: 'Masala Potato & Pea',
    description:
      'Savory masala spiced potatoes and green peas with aromatic herbs',
    price: 13.99,
    category: 'vegetarian',
    image: '/images/pizzas/masala_potato_pea.jpeg',
    ingredients: [
      'Potato',
      'Green Peas',
      'Masala Spices',
      'Onions',
      'Mozzarella',
    ],
    sizes: ['small', 'medium', 'large'],
    available: true,
  },
];

/**
 * Check if database has already been seeded
 */
const isSeeded = async () => {
  const seedFlag = await readData(SEED_FLAG_FILE, null);
  return seedFlag !== null;
};

/**
 * Mark database as seeded
 */
const markAsSeeded = async () => {
  await writeData(SEED_FLAG_FILE, {
    seededAt: new Date().toISOString(),
    version: '1.0.0',
  });
};

/**
 * Seed the database with initial data
 */
export const seedDatabase = async (force = false) => {
  // Check if already seeded
  if (!force && (await isSeeded())) {
    console.log('✓ Database already seeded. Skipping...');
    return {
      seeded: false,
      reason: 'Already seeded',
    };
  }

  console.log('🌱 Seeding database with initial data...');

  try {
    // Initialize empty orders and rewards
    await writeData(ORDERS_FILE, []);
    await writeData(ORDER_COUNTER_FILE, { counter: 1 });
    await writeData(REWARDS_FILE, {});

    // Seed menu data
    await initializeMenu(INITIAL_MENU);

    // Mark as seeded
    await markAsSeeded();

    console.log(`✓ Seeded ${INITIAL_MENU.length} menu items`);
    console.log('✓ Initialized empty orders and rewards');
    console.log('✓ Database seeding completed successfully!');

    return {
      seeded: true,
      stats: {
        menuItems: INITIAL_MENU.length,
        orders: 0,
        users: 0,
      },
    };
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    throw error;
  }
};

/**
 * Clear all seeded data
 */
export const clearDatabase = async () => {
  console.log('🗑️  Clearing database...');

  try {
    await writeData(ORDERS_FILE, []);
    await writeData(ORDER_COUNTER_FILE, { counter: 1 });
    await writeData(REWARDS_FILE, {});
    await writeData(MENU_FILE, []);
    await writeData(SEED_FLAG_FILE, null);

    console.log('✓ Database cleared successfully!');

    return { cleared: true };
  } catch (error) {
    console.error('✗ Error clearing database:', error);
    throw error;
  }
};

/**
 * Reset and reseed the database
 */
export const reseedDatabase = async () => {
  await clearDatabase();
  return await seedDatabase(true);
};

export default {
  seedDatabase,
  clearDatabase,
  reseedDatabase,
};
