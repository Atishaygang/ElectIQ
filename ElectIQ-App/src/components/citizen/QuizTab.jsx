import React, { useState, useEffect, useMemo, useCallback, startTransition } from 'react';
import { db } from '../../config/firebase';
import { ref, onValue } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';
import { useFirebase } from '../../hooks/useFirebase';
import PropTypes from 'prop-types';

import { logger } from '../../utils/logger';
import QuestionCard from './QuestionCard';

/**
 * Quiz component for Citizen portal.
 * @returns {JSX.Element} QuizTab component.
 */
const QuizTab = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showExpl, setShowExpl] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [leaderboardRaw, setLeaderboardRaw] = useState({});
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  
  const { addQuizScore } = useFirebase();

  useEffect(() => {
    const lbRef = ref(db, 'quizScores');
    const unsub = onValue(lbRef, (snapshot) => {
      if (snapshot.exists()) {
        setLeaderboardRaw(snapshot.val());
      }
    });
    return () => unsub();
  }, []);

  const leaderboard = useMemo(() => {
    const arr = Object.values(leaderboardRaw);
    return arr.sort((a, b) => b.score - a.score).slice(0, 10);
  }, [leaderboardRaw]);

  const loadQuiz = useCallback(async (level) => {
    setLoadingQuiz(true);
    let loadedQuestions = [];
    try {
      if (level === 'basic') loadedQuestions = (await import('../../data/quiz-basic.js')).questions;
      else if (level === 'intermediate') loadedQuestions = (await import('../../data/quiz-intermediate.js')).questions;
      else if (level === 'advanced') loadedQuestions = (await import('../../data/quiz-advanced.js')).questions;
      
      startTransition(() => {
        setQuestions(loadedQuestions);
        setDifficulty(level);
        setCurrentIdx(0);
        setScore(0);
        setCompleted(false);
        setSelectedOpt(null);
        setShowExpl(false);
      });
    } catch (e) {
      logger.error('Failed to load quiz:', e);
    } finally {
      setLoadingQuiz(false);
    }
  }, []);

  const handleSelect = useCallback((idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    setShowExpl(true);
    if (idx === questions[currentIdx].correct) {
      setScore(s => s + 1);
    }
  }, [selectedOpt, questions, currentIdx]);

  const handleNext = useCallback(async () => {
    if (currentIdx === questions.length - 1) {
      setCompleted(true);
      try {
        const finalScore = score + (selectedOpt === questions[currentIdx].correct ? 1 : 0);
        await addQuizScore(finalScore, questions.length, difficulty, "Citizen_" + Math.floor(Math.random() * 1000));
      } catch (e) {
        logger.error('Failed to save quiz score:', e);
      }
    } else {
      setSelectedOpt(null);
      setShowExpl(false);
      setCurrentIdx(i => i + 1);
    }
  }, [currentIdx, questions, score, selectedOpt, difficulty, addQuizScore]);

  if (!difficulty || questions.length === 0) {
    return (
      <div className="space-y-6" aria-busy={loadingQuiz ? "true" : "false"}>
        <h2 className="text-2xl font-bold font-heading">Test Your Knowledge</h2>
        <div className="grid gap-4">
          {['basic', 'intermediate', 'advanced'].map(level => (
            <button
              key={level}
              onClick={() => loadQuiz(level)}
              disabled={loadingQuiz}
              className="bg-dark-card border border-gray-700 hover:border-saffron p-6 rounded-xl capitalize text-left transition-all disabled:opacity-50"
            >
              <h3 className="text-xl font-bold text-gray-200">{level}</h3>
              <p className="text-gray-400 text-sm mt-1">10 Questions</p>
            </button>
          ))}
        </div>

        <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
          <h3 className="font-bold flex items-center gap-2 mb-4 text-saffron"><Trophy size={18}/> Top Scholars</h3>
          <div className="space-y-2">
            {leaderboard.map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm p-2 bg-dark-bg rounded border border-gray-800">
                <span className="text-gray-300">{entry.username}</span>
                <span className="font-bold text-green">{entry.score}/{entry.maxScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center bg-dark-card border border-gray-800 p-8 rounded-xl space-y-6">
        <Trophy className="w-20 h-20 text-saffron mx-auto mb-4" />
        <h2 className="text-3xl font-bold font-heading">Quiz Completed!</h2>
        <p className="text-5xl font-bold text-green">{score}/{questions.length}</p>
        <p className="text-gray-400">Great job learning about the democratic process!</p>
        <button onClick={() => { setDifficulty(null); setQuestions([]); }} className="w-full bg-saffron text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition">Take Another Quiz</button>
      </motion.div>
    );
  }

  return (
    <QuestionCard 
      q={questions[currentIdx]}
      currentIdx={currentIdx}
      total={questions.length}
      difficulty={difficulty}
      selectedOpt={selectedOpt}
      showExpl={showExpl}
      onSelect={handleSelect}
      onNext={handleNext}
      isLast={currentIdx === questions.length - 1}
    />
  );
};

export default React.memo(QuizTab);
