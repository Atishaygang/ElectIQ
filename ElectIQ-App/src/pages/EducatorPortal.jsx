import React, { useState, useEffect, startTransition } from 'react';
import { db } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import { LayoutDashboard, FileQuestion, Presentation, BarChart3 } from 'lucide-react';
import DashboardSection from '../components/educator/DashboardSection';
import QuizBuilderSection from '../components/educator/QuizBuilderSection';
import ClassroomMode from '../components/educator/ClassroomMode';
import AnalyticsSection from '../components/educator/AnalyticsSection';

const EducatorPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ questions: 0, popularQuiz: 'Basic', sessions: Math.floor(Math.random() * 500) + 150, recentList: [] });

  useEffect(() => {
    // Fetch stats
    const qRef = ref(db, 'questions');
    const unsub = onValue(qRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const arr = Object.values(val);
        setStats(s => ({ ...s, questions: arr.length, recentList: arr.reverse().slice(0, 10).filter(q => q && q.text) }));
      }
    });
    return () => unsub();
  }, []);

  const handleTabSwitch = (id) => {
    startTransition(() => {
      setActiveTab(id);
    });
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'quiz', name: 'Quiz Builder', icon: FileQuestion },
    { id: 'classroom', name: 'Classroom Mode', icon: Presentation },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="flex h-screen bg-dark-bg text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-card border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <span aria-hidden="true">📚</span>
            Elect<span className="text-saffron">I</span><span className="text-green">Q</span> Edu
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSwitch(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-sm font-medium ${isActive ? 'bg-green/10 text-green' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
              >
                <Icon size={18} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Mobile Header hidden md */}
        <div className="md:hidden flex items-center gap-2 mb-6">
          <span aria-hidden="true">📚</span>
          <span className="font-bold">Educator Portal - Please view on Desktop</span>
        </div>
        {activeTab === 'dashboard' && <DashboardSection stats={stats} />}
        {activeTab === 'quiz' && <QuizBuilderSection />}
        {activeTab === 'classroom' && <ClassroomMode />}
        {activeTab === 'analytics' && <AnalyticsSection stats={stats} />}
      </main>
    </div>
  );
};

export default EducatorPortal;
