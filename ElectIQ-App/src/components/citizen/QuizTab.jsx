import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../config/firebase';
import { ref, push, serverTimestamp, query, limitToLast, orderByChild, onValue } from 'firebase/database';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';

// Basic quiz questions mapping to requirements
const questionsMap = {
  basic: [
    { text: "How many Lok Sabha seats are there?", options: ["543", "545", "500", "550"], correct: 0, expl: "There are currently 543 elected constituencies in the Lok Sabha." },
    { text: "Who conducts elections in India?", options: ["Supreme Court", "Parliament", "Election Commission of India", "President"], correct: 2, expl: "The ECI is an autonomous constitutional authority." },
    { text: "What is the voting age in India?", options: ["21", "18", "16", "25"], correct: 1, expl: "Reduced from 21 to 18 by the 61st Amendment Act, 1988." }
  ],
  intermediate: [
    { text: "What is Form 7B?", options: ["New Voter Regis.", "Withdrawal of Candidature", "Complaint Form", "Victory Cert."], correct: 1, expl: "Form 7B is used by candidates to officially withdraw." },
    { text: "What is NOTA?", options: ["None of the Above", "National Order to Arrive", "New Opinion Test Act", "No Objections"], correct: 0, expl: "NOTA allows voters to express dissatisfaction securely." },
    { text: "What is the minimum age to contest for Lok Sabha?", options: ["35", "30", "25", "21"], correct: 2, expl: "Article 84(b) of Constitution sets the age at 25." }
  ],
  advanced: [
    { text: "What is Section 126 of RPA 1951?", options: ["Disqualification", "Silence Period before polling", "Campaign rules", "Voting rights"], correct: 1, expl: "Prohibits campaigning within 48 hours of poll closing." },
    { text: "What is a returning officer's role?", options: ["Count votes only", "Manage constituency election", "Guard EVM", "Print ballots"], correct: 1, expl: "The RO is the head of the election process in a constituency." }
  ]
};

const QuizTab = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showExpl, setShowExpl] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  // Fetch leaderboard
  useEffect(() => {
    const lbRef = query(ref(db, 'quizScores'), orderByChild('score'), limitToLast(10));
    const unsub = onValue(lbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const arr = Object.values(data).sort((a, b) => b.score - a.score);
        setLeaderboard(arr);
      }
    });
    return () => unsub();
  }, []);

  const activeQuestions = useMemo(() => {
    if (!difficulty) return [];
    return questionsMap[difficulty];
  }, [difficulty]);

  const handleSelect = (idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    setShowExpl(true);
    if (idx === activeQuestions[currentIdx].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx === activeQuestions.length - 1) {
      finishQuiz();
    } else {
      setSelectedOpt(null);
      setShowExpl(false);
      setCurrentIdx(i => i + 1);
    }
  };

  const finishQuiz = async () => {
    setCompleted(true);
    try {
      await push(ref(db, 'quizScores'), {
        score: score + (selectedOpt === activeQuestions[currentIdx].correct ? 1 : 0),
        maxScore: activeQuestions.length,
        level: difficulty,
        timestamp: serverTimestamp(),
        username: "Citizen_" + Math.floor(Math.random() * 1000)
      });
    } catch (e) {
      // ignore
    }
  };

  if (!difficulty) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-heading">Test Your Knowledge</h2>
        <div className="grid gap-4">
          {['basic', 'intermediate', 'advanced'].map(level => (
            <button
              key={level}
              onClick={() => { setDifficulty(level); setCurrentIdx(0); setScore(0); setCompleted(false); selectedOpt !== null && setSelectedOpt(null); setShowExpl(false); }}
              className="bg-dark-card border border-gray-700 hover:border-saffron p-6 rounded-xl capitalize text-left transition-all"
            >
              <h3 className="text-xl font-bold text-gray-200">{level}</h3>
              <p className="text-gray-400 text-sm mt-1">{questionsMap[level].length} Questions</p>
            </button>
          ))}
        </div>

        {/* Leaderboard */}
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
        <p className="text-5xl font-bold text-green">{score}/{activeQuestions.length}</p>
        <p className="text-gray-400">Great job learning about the democratic process!</p>
        <button onClick={() => setDifficulty(null)} className="w-full bg-saffron text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition">Take Another Quiz</button>
      </motion.div>
    );
  }

  const q = activeQuestions[currentIdx];

  return (
    <div className="space-y-6 relative h-full">
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span className="capitalize">{difficulty} Level</span>
        <span>{currentIdx + 1} / {activeQuestions.length}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-saffron transition-all duration-300" style={{ width: `${((currentIdx) / activeQuestions.length) * 100}%` }}></div>
      </div>

      <motion.div
        key={currentIdx}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        className="bg-dark-card border border-gray-800 p-6 rounded-xl space-y-6"
      >
        <h3 className="text-xl font-medium text-white leading-tight">{q.text}</h3>
        
        <div className="space-y-3">
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
                disabled={showExpl}
                onClick={() => handleSelect(i)}
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
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4" role="alert" aria-live="polite">
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-400">Explanation</p>
                <p className="text-sm text-gray-300 mt-1">{q.expl}</p>
              </div>
              <button
                onClick={handleNext}
                className="mt-6 w-full bg-saffron text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition"
              >
                {currentIdx === activeQuestions.length - 1 ? 'See Results' : 'Next Question'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default QuizTab;
