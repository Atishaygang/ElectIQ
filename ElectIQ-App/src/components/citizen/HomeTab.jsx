import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../../config/firebase';
import { ref, query, limitToLast, onValue } from 'firebase/database';
import { ChevronRight, Calendar, MessageSquare, BookOpen, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const HomeTab = ({ navigate }) => {
  const [recentQuestions, setRecentQuestions] = useState([]);
  
  // Calculate countdown to next election (mocking an arbitrary future date)
  const nextElectionDate = useMemo(() => new Date('2029-04-15T00:00:00'), []);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const diff = nextElectionDate.getTime() - new Date().getTime();
    setDaysLeft(Math.floor(diff / (1000 * 60 * 60 * 24)));

    // Load recent questions from Firebase
    const questionsRef = query(ref(db, 'questions'), limitToLast(5));
    const unsubscribe = onValue(questionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const questionsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).reverse();
        setRecentQuestions(questionsList);
      }
    });

    return () => unsubscribe();
  }, [nextElectionDate]);

  const quickActions = useMemo(() => [
    { title: "How do I vote?", icon: <MessageSquare size={20} />, bg: "bg-saffron/20 border-saffron/50 text-saffron" },
    { title: "What is EVM?", icon: <BookOpen size={20} />, bg: "bg-green/20 border-green/50 text-green" },
    { title: "Check my constituency", icon: <MessageSquare size={20} />, bg: "bg-blue-500/20 border-blue-500/50 text-blue-400" },
    { title: "Election timeline", icon: <Clock size={20} />, bg: "bg-purple-500/20 border-purple-500/50 text-purple-400" },
  ], []);

  const handleQuickAction = useCallback((question) => {
    navigate('/citizen/chat', { state: { initialMessage: question } });
  }, [navigate]);

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-dark-card to-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl"
      >
        <p className="text-gray-400 text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h2 className="text-2xl font-bold text-white mt-1 mb-4">Welcome to ElectIQ</h2>
        
        <div className="bg-dark-bg p-4 rounded-lg flex items-center justify-between border border-gray-800">
          <div className="flex items-center gap-3">
            <Calendar className="text-saffron" />
            <div>
              <p className="text-sm text-gray-400 font-medium">Next Major Election</p>
              <p className="text-white font-bold">Lok Sabha 2029</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-heading font-bold text-saffron">{daysLeft}</p>
            <p className="text-xs text-gray-400 font-medium">Days Left</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-200">Quick Questions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, idx) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={idx}
              onClick={() => handleQuickAction(action.title)}
              className={`p-4 rounded-xl border flex flex-col gap-2 items-start text-left transition-colors hover:bg-opacity-30 ${action.bg}`}
            >
              {action.icon}
              <span className="font-semibold text-sm mt-2 leading-tight">{action.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Questions */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-200">Community Asking</h3>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green"></span>
          </span>
        </div>
        
        <div className="bg-dark-card rounded-xl border border-gray-800 divide-y divide-gray-800">
          {recentQuestions.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No recent questions.</p>
          ) : (
            recentQuestions.map((q) => (
              <div key={q.id} className="p-4 flex justify-between items-center">
                <span className="text-sm text-gray-300 truncate pr-4">"{q.text}"</span>
                <ChevronRight size={16} className="text-gray-600 flex-shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

HomeTab.propTypes = {
  navigate: PropTypes.func.isRequired
};

export default React.memo(HomeTab);
