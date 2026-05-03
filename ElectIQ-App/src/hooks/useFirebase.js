import { useCallback } from 'react';
import { saveQuestion, saveQuizScore, fetchRecentQuestions } from '../utils/firebaseHelpers';

/**
 * Hook to interact with Firebase using memoized functions.
 */
export const useFirebase = () => {
  const addQuestion = useCallback(async (text, sessionId) => {
    return await saveQuestion(text, sessionId);
  }, []);

  const addQuizScore = useCallback(async (score, maxScore, level, username) => {
    return await saveQuizScore(score, maxScore, level, username);
  }, []);

  const getRecentQuestions = useCallback(async (limit = 5) => {
    return await fetchRecentQuestions(limit);
  }, []);

  return {
    addQuestion,
    addQuizScore,
    getRecentQuestions
  };
};
