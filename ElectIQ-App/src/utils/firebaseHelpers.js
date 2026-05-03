import { db } from '../config/firebase';
import { ref, push, set, serverTimestamp, query, limitToLast, orderByChild, get } from 'firebase/database';
import { APP_CONFIG } from '../config/appConfig';
import { logger } from './logger';

/**
 * Pushes a new question to the database.
 * @param {string} text 
 * @param {string} sessionId 
 * @returns {Promise<void>}
 */
export const saveQuestion = async (text, sessionId) => {
  try {
    const newRef = push(ref(db, APP_CONFIG.FIREBASE_PATHS.QUESTIONS));
    await set(newRef, {
      text,
      sessionId,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    logger.error("Failed to save question:", error);
    throw error;
  }
};

/**
 * Saves a quiz score to the database.
 * @param {number} score 
 * @param {number} maxScore 
 * @param {string} level 
 * @param {string} username 
 * @returns {Promise<void>}
 */
export const saveQuizScore = async (score, maxScore, level, username) => {
  try {
    const newRef = push(ref(db, APP_CONFIG.FIREBASE_PATHS.SCORES));
    await set(newRef, {
      score,
      maxScore,
      level,
      username,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    logger.error("Failed to save quiz score:", error);
    throw error;
  }
};

/**
 * Fetches recent questions.
 * @param {number} limit 
 * @returns {Promise<any[]>}
 */
export const fetchRecentQuestions = async (limit = 5) => {
  try {
    const q = query(ref(db, APP_CONFIG.FIREBASE_PATHS.QUESTIONS), limitToLast(limit));
    const snapshot = await get(q);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse();
    }
    return [];
  } catch (error) {
    logger.error("Failed to fetch recent questions:", error);
    throw error;
  }
};
