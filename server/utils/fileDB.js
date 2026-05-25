const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

/**
 * Read a JSON data file
 * @param {string} filename - Name of the JSON file (e.g., 'movies.json')
 * @returns {Array|Object} Parsed JSON data
 */
function readData(filename) {
  const filePath = path.join(dataDir, filename);
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err.message);
    return [];
  }
}

/**
 * Write data to a JSON file
 * @param {string} filename - Name of the JSON file
 * @param {Array|Object} data - Data to write
 */
function writeData(filename, data) {
  const filePath = path.join(dataDir, filename);
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filename}:`, err.message);
    throw err;
  }
}

/**
 * Generate a simple unique ID
 * @returns {string} UUID-like string
 */
function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

module.exports = { readData, writeData, generateId };
