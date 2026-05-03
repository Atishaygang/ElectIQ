import React, { useState, useEffect, useMemo, useCallback, startTransition } from 'react';
import { db } from '../../config/firebase';
import { ref, onValue } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';
import { useFirebase } from '../../hooks/useFirebase';
import PropTypes from 'prop-types';

const QuestionCard = React.memo(({ q, currentIdx, total, difficulty, selectedOpt, showExpl, onSelect, onNext, isLast }) => {
  return (
    <div className="space-y-6 relative h-full">
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span className="capitalize">{difficulty} Level</span>
        <span>{currentIdx + 1} / {total}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-saffron transition-all duration-300" style={{ width: `${((currentIdx) / total) * 100}%` }}></div>
      </div>

      <motion.div
        key={currentIdx}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        className="bg-dark-card border border-gray-800 p-6 rounded-xl space-y-6"
      >
        <h3 id="question-text" className="text-xl font-medium text-white leading-tight">{q.text}</h3>
        
        <div className="space-y-3" role="radiogroup" aria-labelledby="question-text">
          {q.options.map((opt, i) => {
            const isSelected = selectedOpt === i;
            const isCorrect = q.correct === i;
            let btnClass = "bg-dark-bg border-gray-700 hover:border-gray-500 text-gray-300";
            
            if (showExpl) {
              if (isCorrect) btnClass = "bg-green/20 border-green text-green";
              else if (isSelected && !isCorrect) btnClass = "bg-red-500/20 border-red-500 text-red-500";
              else btnClass = "bg-dark-bg border-gray-800 text-gray-600 opacity-50";
            }

            return (
              <button
                key={i}
                role="radio"
                aria-checked={isSelected}
                disabled={showExpl}
                onClick={() => onSelect(i)}
                aria-describedby={showExpl ? "expl-text" : undefined}
                className={`w-full text-left p-4 rounded-lg border transition flex justify-between items-center ${btnClass}`}
              >
                <span>{opt}</span>
                {showExpl && isCorrect && <CheckCircle2 size={18} className="text-green" />}
                {showExpl && isSelected && !isCorrect && <XCircle size={18} className="text-red-500" />}
              </button>
            )
          })}
        </div>

        <AnimatePresence>
          {showExpl && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4" role="alert" aria-live="assertive">
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-400">Explanation</p>
                <p id="expl-text" className="text-sm text-gray-300 mt-1">{q.expl}</p>
              </div>
              <button
                onClick={onNext}
                className="mt-6 w-full bg-saffron text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition"
              >
                {isLast ? 'See Results' : 'Next Question'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});

QuestionCard.propTypes = {
  q: PropTypes.object.isRequired,
  currentIdx: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  difficulty: PropTypes.string.isRequired,
  selectedOpt: PropTypes.number,
  showExpl: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  isLast: PropTypes.bool.isRequired
};

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
      console.error(e);
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
      } catch (e) {}
    } else {
      setSelectedOpt(null);
      setShowExpl(false);
      setCurrentIdx(i => i + 1);
    }
  }, [currentIdx, questions, score, selectedOpt, difficulty, addQuizScore]);

  if (!difficulty || questions.length === 0) {
    return (
      <div className="space-y-6" aria-busy={loadingQuiz}>
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
