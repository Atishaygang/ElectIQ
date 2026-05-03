import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { TIMELINE_STEPS } from '../../constants/electionData';

const ClassroomMode = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' && step < TIMELINE_STEPS.length - 1) setStep(s => s + 1);
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
            <h2 className="text-6xl font-heading font-black text-white leading-tight">{TIMELINE_STEPS[step].title}</h2>
            <div className="w-48 h-48 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center border-4 border-dashed border-gray-700 mt-8">
              <span className="text-gray-500">Illustration Area</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <button onClick={() => setStep(s => s<TIMELINE_STEPS.length-1?s+1:s)} className="absolute right-8 p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition" disabled={step===TIMELINE_STEPS.length-1}>
          <ChevronRight size={32} />
        </button>
      </div>
      <div className="h-2 bg-gray-800 w-full" aria-label="Presentation progress">
        <div className="h-full bg-green transition-all" style={{width: `${((step+1)/TIMELINE_STEPS.length)*100}%`}}></div>
      </div>
    </div>
  );
};

export default ClassroomMode;
