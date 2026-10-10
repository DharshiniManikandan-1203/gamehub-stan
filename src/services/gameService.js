/**
 * Game Service Layer
 * 
 * Simulates real REST API behavior with asynchronous latency,
 * category filtering, search querying, and error handling.
 * 
 * In an interview, explain that isolating data fetching into a dedicated
 * service layer adheres to the Single Responsibility Principle: UI components
 * stay clean and don't care whether data comes from local mock or a real backend.
 */

import gamesData from '../data/games.json';

export const CATEGORIES = [
  'All',
  'Action',
  'Puzzle',
  'Racing',
  'RPG',
  'Sports',
  'Arcade',
  'Adventure',
];

// Simulated network latency (in milliseconds)
const NETWORK_LATENCY_MS = 400;

/**
 * Fetch list of games with optional category filtering and search query
 * @param {Object} options
 * @param {string} [options.category] - Category filter ('All', 'Action', etc.)
 * @param {string} [options.search] - Search keyword for filtering
 * @param {boolean} [options.forceError] - Simulate network failure for testing error states
 * @returns {Promise<Array>} Array of game objects
 */
export const fetchGames = async ({ category = 'All', search = '', forceError = false } = {}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate network error if requested (for testing error UI & retry)
      if (forceError) {
        reject(new Error('Network error: Unable to load games from GameHub server.'));
        return;
      }

      let results = [...gamesData];

      // 1. Filter by category
      if (category && category !== 'All') {
        results = results.filter(
          (game) => game.category.toLowerCase() === category.toLowerCase()
        );
      }

      // 2. Filter by search query (checks name, description, and tags)
      const query = search.trim().toLowerCase();
      if (query.length > 0) {
        results = results.filter((game) => {
          const matchName = game.name.toLowerCase().includes(query);
          const matchCategory = game.category.toLowerCase().includes(query);
          const matchDesc = game.description.toLowerCase().includes(query);
          const matchTags = game.tags?.some((tag) => tag.toLowerCase().includes(query));
          return matchName || matchCategory || matchDesc || matchTags;
        });
      }

      resolve(results);
    }, NETWORK_LATENCY_MS);
  });
};

/**
 * Fetch a single game by ID
 * @param {string} id - Game ID (e.g. 'g1')
 * @returns {Promise<Object>} Game object
 */
export const fetchGameById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const game = gamesData.find((g) => g.id === id);
      if (game) {
        resolve(game);
      } else {
        reject(new Error(`Game with ID "${id}" was not found.`));
      }
    }, NETWORK_LATENCY_MS / 2);
  });
};

/**
 * Fetch all available categories
 * @returns {Array<string>}
 */
export const fetchCategories = () => {
  return CATEGORIES;
};
