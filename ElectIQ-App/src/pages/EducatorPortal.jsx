import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import { GOOGLE_SERVICES } from '../config/googleServices';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { LayoutDashboard, FileQuestion, Presentation, BarChart3, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock timeline steps for classroom mode
const timelineSteps = [
  "Election Commission Announcement", "Model Code of Conduct Begins", "Voter List Finalization",
  "Nomination Filing", "Scrutiny of Nominations", "Withdrawal of Candidature",
  "Campaign Period", "Campaign Silence Period", "Polling Day",
  "EVM Sealing & Storage", "Vote Counting", "Result Declaration & Oath"
];

const DashboardSection = ({ stats }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold font-heading">Educator Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-dark-card border border-green/30 p-6 rounded-xl border-t-4 border-t-green">
        <p className="text-gray-400 font-medium">Total Questions Asked</p>
        <p className="text-4xl font-bold text-white mt-2">{stats.questions}</p>
      </div>
      <div className="bg-dark-card border border-purple-500/30 p-6 rounded-xl border-t-4 border-t-purple-500">
        <p className="text-gray-400 font-medium">Most Popular Quiz</p>
        <p className="text-3xl font-bold text-white mt-2 pt-1">{stats.popularQuiz || 'Basic'}</p>
      </div>
      <div className="bg-dark-card border border-blue-500/30 p-6 rounded-xl border-t-4 border-t-blue-500">
        <p className="text-gray-400 font-medium">Active Sessions Today</p>
        <p className="text-4xl font-bold text-white mt-2">{stats.sessions}</p>
      </div>
    </div>
    
    <div className="bg-dark-card border border-gray-800 rounded-xl p-6">
      <h3 className="font-bold flex justify-between items-center mb-4 text-green">
        ⚡ Powered by Google Services
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(GOOGLE_SERVICES).map(([key, svc]) => (
          <div key={key} className="bg-dark-bg p-3 rounded-lg border border-gray-800 flex items-start gap-3">
            <CheckCircle2 className="text-green w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-gray-200">{svc.name}</h4>
              <p className="text-xs text-gray-400">{svc.usage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const QuizBuilderSection = () => {
  const [formData, setFormData] = useState({ text: '', opt0: '', opt1: '', opt2: '', opt3: '', correct: 0, expl: '', diff: 'basic' });
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await push(ref(db, 'customQuizzes'), {
        ...formData,
        options: [formData.opt0, formData.opt1, formData.opt2, formData.opt3],
        timestamp: serverTimestamp()
      });
      setStatus('Saved successfully!');
      setFormData(prev => ({ ...prev, text: '', opt0: '', opt1: '', opt2: '', opt3: '', expl: '' }));
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Error saving quiz.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold font-heading">Quiz Builder</h2>
      <form onSubmit={submit} className="bg-dark-card border border-gray-800 p-6 rounded-xl space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Question Text</label>
          <input required type="text" value={formData.text} onChange={e=>setFormData({...formData, text: e.target.value})} className="w-full bg-dark-bg border border-gray-700 py-2 px-3 rounded text-white focus:border-green focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[0,1,2,3].map(i => (
            <div key={i}>
              <label className="block text-sm text-gray-400 mb-1">Option {i + 1}</label>
              <input required type="text" value={formData[`opt${i}`]} onChange={e=>setFormData({...formData, [`opt${i}`]: e.target.value})} className="w-full bg-dark-bg border border-gray-700 py-2 px-3 rounded text-white focus:border-green focus:outline-none" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Correct Option index (0-3)</label>
            <input required type="number" min="0" max="3" value={formData.correct} onChange={e=>setFormData({...formData, correct: parseInt(e.target.value)})} className="w-full bg-dark-bg border border-gray-700 py-2 px-3 rounded text-white focus:border-green focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
            <select value={formData.diff} onChange={e=>setFormData({...formData, diff: e.target.value})} className="w-full bg-dark-bg border border-gray-700 py-2 px-3 rounded text-white focus:border-green focus:outline-none">
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Explanation</label>
          <textarea required value={formData.expl} onChange={e=>setFormData({...formData, expl: e.target.value})} className="w-full bg-dark-bg border border-gray-700 py-2 px-3 rounded text-white focus:border-green focus:outline-none h-24"></textarea>
        </div>
        <button type="submit" className="bg-green text-white px-6 py-2 rounded font-bold hover:bg-opacity-90">Save Question</button>
        {status && <span className="ml-4 text-sm text-green">{status}</span>}
      </form>
    </div>
  );
};

const ClassroomMode = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' && step < timelineSteps.length - 1) setStep(s => s + 1);
      if (e.key === 'ArrowLeft' && step > 0) setStep(s => s - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step]);

  return (
    <div className="h-[80vh] flex flex-col bg-dark-card border border-gray-800 rounded-xl overflow-hidden relative">
      <div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center text-gray-400">
        <span>Classroom Presentation Mode</span>
        <span className="text-sm">Use Arrow Keys (← →)</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative">
        <button onClick={() => setStep(s => s>0?s-1:s)} className="absolute left-8 p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition" disabled={step===0}>
          <ChevronLeft size={32} />
        </button>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 max-w-4xl"
          >
            <h3 className="text-3xl text-saffron font-bold">Step {step + 1}</h3>
            <h2 className="text-6xl font-heading font-black text-white leading-tight">{timelineSteps[step]}</h2>
            <div className="w-48 h-48 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center border-4 border-dashed border-gray-700 mt-8">
              <span className="text-gray-500">Illustration Area</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <button onClick={() => setStep(s => s<timelineSteps.length-1?s+1:s)} className="absolute right-8 p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition" disabled={step===timelineSteps.length-1}>
          <ChevronRight size={32} />
        </button>
      </div>
      <div className="h-2 bg-gray-800 w-full">
        <div className="h-full bg-green transition-all" style={{width: `${((step+1)/timelineSteps.length)*100}%`}}></div>
      </div>
    </div>
  );
};

const AnalyticsSection = ({ stats }) => {
  const chartData = [
    { day: 'Mon', sessions: 120 }, { day: 'Tue', sessions: 150 }, { day: 'Wed', sessions: 180 },
    { day: 'Thu', sessions: 170 }, { day: 'Fri', sessions: 210 }, { day: 'Sat', sessions: 350 }, { day: 'Sun', sessions: 310 }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-heading">Global Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-card border border-gray-800 p-6 rounded-xl space-y-4">
          <h3 className="font-bold">Active Sessions (Mock Data Analytics)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                <XAxis dataKey="day" stroke="#718096" />
                <YAxis stroke="#718096" />
                <Tooltip contentStyle={{ backgroundColor: '#1a202c', borderColor: '#4a5568' }} />
                <Line type="monotone" dataKey="sessions" stroke="#138808" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-card border border-gray-800 p-6 rounded-xl space-y-4 flex flex-col">
          <h3 className="font-bold">Recent Questions</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {stats.recentList.length === 0 ? <p className="text-gray-500">No questions yet</p> : 
              stats.recentList.map((q, i) => (
                <div key={i} className="p-3 bg-dark-bg text-sm text-gray-300 rounded border border-gray-800">
                  {q.text}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

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
                onClick={() => setActiveTab(item.id)}
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
