/**
 * @typedef {Object} TimelineStep
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} duration
 * @property {string} status - 'completed' | 'current' | 'upcoming'
 * @property {string[]} keyFacts
 */

/**
 * @typedef {Object} QuizQuestion
 * @property {string} text
 * @property {string[]} options
 * @property {number} correct
 * @property {string} expl
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} role - 'user' | 'model'
 * @property {string} text
 * @property {number} timestamp
 */
