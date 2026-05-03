import React, { useState, useCallback } from 'react';
import { ChevronRight, ArrowRight, MousePointerClick, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ELECTION_TYPES, REGISTRATION_STEPS, HELPLINE_NUMBERS } from '../../constants/electionData';

/**
 * Explore component for Citizen portal showing election info and guides.
 * @returns {JSX.Element} ExploreTab component.
 */
const ExploreTab = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = useCallback((id) => {
    setOpenSection(prev => prev === id ? null : id);
  }, []);

  return (
    <div className="space-y-6 pb-8">
      <h2 className="text-2xl font-bold font-heading mb-4">Explore Democracy</h2>
      
      {/* Types of Elections */}
      <div className="grid grid-cols-2 gap-4">
        {ELECTION_TYPES.map(card => (
          <div key={card.title} className={`bg-gradient-to-br ${card.color} p-4 rounded-xl shadow-lg relative overflow-hidden group cursor-pointer`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <span className="text-6xl" aria-hidden="true">🏛️</span>
            </div>
            <h3 className="font-bold text-white text-lg relative z-10">{card.title}</h3>
            <p className="text-white/80 text-xs mt-1 relative z-10">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* EVM Explainer */}
      <div className="bg-dark-card border border-gray-800 rounded-xl overflow-hidden">
        <button 
          onClick={() => toggleSection('evm')}
          className="w-full flex justify-between items-center p-4 bg-gray-800/20 hover:bg-gray-800/40 transition"
          aria-expanded={openSection === 'evm'}
          aria-controls="evm-section"
        >
          <span className="font-bold font-heading text-lg">EVM Flow Diagram</span>
          <ChevronRight size={20} className={`transform transition-transform ${openSection === 'evm' ? 'rotate-90' : ''}`} />
        </button>
        <AnimatePresence>
          {openSection === 'evm' && (
            <motion.div id="evm-section" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="p-6 flex flex-col items-center gap-4">
                {/* SVG EVM Diagram Mock */}
                <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                  <div className="flex-1 bg-dark-bg border border-blue-500 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <MousePointerClick className="text-blue-500" />
                    </div>
                    <h4 className="font-bold text-sm text-blue-400">Ballot Unit</h4>
                    <p className="text-xs text-gray-400">Voter presses button next to candidate symbol</p>
                  </div>
                  <ArrowRight className="hidden md:block text-gray-600" />
                  <div className="flex-1 bg-dark-bg border border-green rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-green/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <CheckCircle2 className="text-green" />
                    </div>
                    <h4 className="font-bold text-sm text-green">Control Unit</h4>
                    <p className="text-xs text-gray-400">Records the vote electronically securely</p>
                  </div>
                  <ArrowRight className="hidden md:block text-gray-600" />
                  <div className="flex-1 bg-dark-bg border border-purple-500 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-2 flex items-center justify-center text-xl">
                      📄
                    </div>
                    <h4 className="font-bold text-sm text-purple-400">VVPAT</h4>
                    <p className="text-xs text-gray-400">Prints paper slip confirming the correct vote</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Voter Registration */}
      <div className="bg-dark-card border border-gray-800 rounded-xl overflow-hidden">
        <button 
          onClick={() => toggleSection('registration')}
          className="w-full flex justify-between items-center p-4 bg-gray-800/20 hover:bg-gray-800/40 transition"
          aria-expanded={openSection === 'registration'}
          aria-controls="registration-section"
        >
          <span className="font-bold font-heading text-lg">Registration Guide (Form 6)</span>
          <ChevronRight size={20} className={`transform transition-transform ${openSection === 'registration' ? 'rotate-90' : ''}`} />
        </button>
        <AnimatePresence>
          {openSection === 'registration' && (
            <motion.div id="registration-section" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="p-6">
                <ol className="relative border-l border-gray-700 ml-3 space-y-6">
                  {REGISTRATION_STEPS.map((step, idx) => (
                    <li key={idx} className="pl-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-saffron rounded-full -left-3 ring-4 ring-dark-card text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <h3 className="font-medium text-gray-300 text-sm">{step}</h3>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Embed */}
      <div className="bg-dark-card border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold font-heading mb-3 flex items-center gap-2">
          <span>🏛️ Election Commission HQ</span>
        </h3>
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=Election+Commission+of+India,New+Delhi`}
          width="100%" height="250" style={{ border: 0, borderRadius: '12px' }} allowFullScreen loading="lazy"
          title="Map showing ECI Headquarters"
        ></iframe>
        <div className="mt-4 flex gap-4 text-sm text-gray-400 border-t border-gray-800 pt-3">
          <p><strong>Voter Helpline:</strong> {HELPLINE_NUMBERS.voterHelpline}</p>
          <p><strong>Toll Free:</strong> {HELPLINE_NUMBERS.tollFree}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ExploreTab);
