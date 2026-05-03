import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GOOGLE_SERVICES } from '../config/googleServices';
import { CheckSquare, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { STRINGS } from '../constants/strings';
import { ROUTES } from '../constants/routes';

/**
 * Landing page component.
 * @returns {JSX.Element} LandingPage component.
 */
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-saffron via-white to-green"></div>
      
      <div className="w-full max-w-4xl flex flex-col items-center z-10 space-y-12 text-center">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <CheckSquare className="w-16 h-16 text-saffron" aria-hidden="true" />
            <BrainCircuit className="w-16 h-16 text-green" aria-hidden="true" />
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-white">
            Elect<span className="text-saffron">I</span><span className="text-green">Q</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-medium">
            {STRINGS.TAGLINE}
          </p>
        </motion.div>

        {/* Portals Selection */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl px-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(ROUTES.CITIZEN)}
            className="flex-1 bg-dark-card border-2 border-saffron hover:bg-saffron/10 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 transition-colors group cursor-pointer focus-visible:outline-white"
            aria-label="Enter Citizen Portal"
          >
            <span className="text-5xl group-hover:animate-bounce" aria-hidden="true">🗳️</span>
            <span className="text-2xl font-bold text-white">I'm a Citizen</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(ROUTES.EDUCATOR)}
            className="flex-1 bg-dark-card border-2 border-green hover:bg-green/10 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 transition-colors group cursor-pointer focus-visible:outline-white"
            aria-label="Enter Educator Portal"
          >
            <span className="text-5xl group-hover:animate-bounce" aria-hidden="true">📚</span>
            <span className="text-2xl font-bold text-white">I'm an Educator</span>
          </motion.button>
        </div>

        {/* Stats Bar */}
        <div className="w-full bg-dark-card/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800 my-8">
          <p className="text-gray-400 font-semibold md:text-lg flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-700 justify-center items-center">
            <span className="px-4 py-2">543 Lok Sabha Seats</span>
            <span className="px-4 py-2">4000+ Constituencies</span>
            <span className="px-4 py-2">96 Crore Voters</span>
          </p>
        </div>

        {/* Google Powered Badge Row */}
        <div className="flex flex-col items-center space-y-4 pt-12">
          <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">⚡ Powered by Google</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm text-gray-400">
            {Object.keys(GOOGLE_SERVICES).map(key => (
              <div key={key} className="flex items-center space-x-1 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
                <CheckCircle2 className="w-4 h-4 text-green" />
                <span>{GOOGLE_SERVICES[key].name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
