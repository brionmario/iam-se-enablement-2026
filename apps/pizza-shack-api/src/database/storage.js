import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = __dirname;

/**
 * Database storage utility for file-based persistence
 */

/**
 * Ensure database directory exists
 */
const ensureDbDir = async () => {
  try {
    await fs.access(DB_DIR);
  } catch {
    await fs.mkdir(DB_DIR, { recursive: true });
  }
};

/**
 * Read data from a JSON file
 * @param {string} filename - Name of the file (without path)
 * @param {*} defaultValue - Default value if file doesn't exist
 * @returns {Promise<*>} Parsed data or default value
 */
export const readData = async (filename, defaultValue = null) => {
  try {
    await ensureDbDir();
    const filePath = path.join(DB_DIR, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default value
      return defaultValue;
    }
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
};

/**
 * Write data to a JSON file
 * @param {string} filename - Name of the file (without path)
 * @param {*} data - Data to write
 * @returns {Promise<void>}
 */
export const writeData = async (filename, data) => {
  try {
    await ensureDbDir();
    const filePath = path.join(DB_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
};

/**
 * Initialize a data file if it doesn't exist
 * @param {string} filename - Name of the file
 * @param {*} initialData - Initial data to write
 * @returns {Promise<void>}
 */
export const initializeData = async (filename, initialData) => {
  try {
    await ensureDbDir();
    const filePath = path.join(DB_DIR, filename);
    await fs.access(filePath);
    // File exists, don't overwrite
  } catch {
    // File doesn't exist, create it
    await writeData(filename, initialData);
  }
};

export default {
  readData,
  writeData,
  initializeData,
};
