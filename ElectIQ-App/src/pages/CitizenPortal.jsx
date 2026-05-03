import React, { useState, startTransition, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Clock, BookOpen, Compass, Globe } from 'lucide-react';
import { HomeTab, ChatTab, TimelineTab, QuizTab, ExploreTab } from '../components/citizen';
import { ErrorBoundary } from '../components/shared';
import { STRINGS } from '../constants/strings';
import { ROUTES } from '../constants/routes';
import PropTypes from 'prop-types';

/**
 * CitizenPortal component containing routing and navigation for the citizen side.
 * @returns {JSX.Element} CitizenPortal component.
 */
const CitizenPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState('en');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    startTransition(() => {
      setLang(prev => prev === 'en' ? 'hi' : 'en');
    });
  }, []);

  const handleTabClick = useCallback((path) => {
    startTransition(() => {
      navigate(path);
    });
  }, [navigate]);

  const tabs = [
    { id: '', name: 'Home', icon: Home, path: ROUTES.CITIZEN },
    { id: 'chat', name: 'Chat', icon: MessageCircle, path: `${ROUTES.CITIZEN}/chat` },
    { id: 'timeline', name: 'Timeline', icon: Clock, path: `${ROUTES.CITIZEN}/timeline` },
    { id: 'quiz', name: 'Quiz', icon: BookOpen, path: `${ROUTES.CITIZEN}/quiz` },
    { id: 'explore', name: 'Explore', icon: Compass, path: `${ROUTES.CITIZEN}/explore` }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-gray-100 pb-16">
      {/* Header */}
      <header className="bg-dark-card border-b border-gray-800 p-4 sticky top-0 z-40 flex justify-between items-center">
        <h1 className="text-xl font-heading font-bold text-white flex items-center gap-2">
          <span aria-hidden="true">🗳️</span>
          Elect<span className="text-saffron">I</span><span className="text-green">Q</span> Citizen
        </h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            aria-label="Toggle Language"
            aria-pressed={lang === 'hi'}
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded border transition-colors ${lang === 'hi' ? 'bg-saffron text-white border-saffron' : 'border-gray-700 text-gray-400'}`}
          >
            <Globe size={14} />
            {lang === 'en' ? 'HI' : 'EN'}
          </button>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green"></span>
            </span>
            <span className="text-xs text-gray-400 font-medium" role="status">{STRINGS.FIREBASE_LIVE}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 flex flex-col relative">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomeTab navigate={navigate} />} />
            <Route path="/chat" element={<ChatTab />} />
            <Route path="/timeline" element={<TimelineTab />} />
            <Route path="/quiz" element={<QuizTab />} />
            <Route path="/explore" element={<ExploreTab />} />
          </Routes>
        </ErrorBoundary>
      </main>

      {/* Bottom Navigation (Mobile First) */}
      <nav className="fixed bottom-0 w-full bg-dark-card border-t border-gray-800 flex justify-around p-2 pb-safe z-40">
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path || (tab.path !== '/citizen' && location.pathname.startsWith(tab.path));
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.path)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors min-w-[64px] ${isActive ? 'text-saffron' : 'text-gray-500 hover:text-gray-300'}`}
              aria-label={`${tab.name} Tab`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

CitizenPortal.propTypes = {};

export default CitizenPortal;
