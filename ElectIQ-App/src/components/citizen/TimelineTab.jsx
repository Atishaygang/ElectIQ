import React, { useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Share2, CheckCircle2, CircleDot, Circle } from 'lucide-react';
import { TIMELINE_STEPS } from '../../constants/electionData';
import PropTypes from 'prop-types';

const turnoutData = [
  { year: '1952', turnout: 45.7 },
  { year: '1977', turnout: 60.5 },
  { year: '1999', turnout: 59.9 },
  { year: '2014', turnout: 66.4 },
  { year: '2019', turnout: 67.4 },
  { year: '2024', turnout: 65.8 },
];

/**
 * Renders a single timeline step.
 * @param {Object} props Component props.
 * @param {Object} props.step The step data.
 * @param {boolean} props.isExpanded Is the step expanded.
 * @param {Function} props.onToggle Toggle handler.
 * @param {number} props.index The step index.
 * @param {number} props.totalSteps Total number of steps.
 * @returns {JSX.Element} TimelineStep component.
 */
const TimelineStep = React.memo(({ step, isExpanded, onToggle, index, totalSteps }) => {
  const contentRef = React.useRef(null);

  React.useEffect(() => {
    if (isExpanded && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isExpanded]);

  const getIcon = () => {
    if (step.status === 'completed') return <CheckCircle2 className="text-green w-6 h-6" />;
    if (step.status === 'current') return <CircleDot className="text-saffron w-6 h-6 animate-pulse" />;
    return <Circle className="text-gray-600 w-6 h-6" />;
  };

  const borderClass = step.status === 'completed' ? 'border-green' : step.status === 'current' ? 'border-saffron' : 'border-gray-700';

  return (
    <div className="relative pl-8 pb-8">
      {/* Vertical Line */}
      <div className={`absolute left-3 top-6 bottom-0 w-0.5 ${borderClass}`} />
      
      {/* Node */}
      <button 
        className="absolute left-0 top-0 bg-dark-bg p-0.5 rounded-full z-10" 
        onClick={onToggle}
        aria-label={`Toggle Step ${step.id}: ${step.title}`}
        aria-expanded={isExpanded}
        aria-setsize={totalSteps}
        aria-posinset={index + 1}
      >
        {getIcon()}
      </button>

      <div 
        onClick={onToggle}
        className={`bg-dark-card border ${borderClass} rounded-xl p-4 cursor-pointer hover:bg-gray-800/50 transition-colors`}
      >
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-gray-200">Step {step.id}: {step.title}</h4>
          <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">{step.duration}</span>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-3"
            >
              <div ref={contentRef} tabIndex={-1} className="outline-none">
                <p className="text-sm text-gray-400 mb-3">{step.desc}</p>
                
                <div className="bg-saffron/10 border border-saffron/30 rounded p-3 mb-3 flex gap-2 items-start">
                  <Info size={16} className="text-saffron shrink-0 mt-0.5" />
                  <p className="text-xs text-saffron font-medium">Key Rule: {step.rule}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  aria-label="Share this step"
                  className="text-gray-400 hover:text-white flex items-center gap-1 text-xs"
                >
                  <Share2 size={14} /> Share
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

TimelineStep.propTypes = {
  step: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    rule: PropTypes.string.isRequired
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired
};

/**
 * Timeline component for Citizen portal.
 * @returns {JSX.Element} TimelineTab component.
 */
const TimelineTab = () => {
  const [expandedId, setExpandedId] = useState(4); // default expanded is the current one

  const handleToggle = useCallback((id) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="text-2xl font-bold font-heading mb-2">Election Journey</h2>
        <p className="text-gray-400 text-sm">Follow the 12 critical steps of an Indian election.</p>
      </div>

      <div className="bg-dark-card border border-gray-800 rounded-xl p-4">
        {TIMELINE_STEPS.map((step, idx) => (
          <TimelineStep 
            key={step.id} 
            step={step} 
            isExpanded={expandedId === step.id}
            onToggle={() => handleToggle(step.id)}
            index={idx}
            totalSteps={TIMELINE_STEPS.length}
          />
        ))}
      </div>

      <div className="bg-dark-card border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold mb-4 font-heading text-lg">Historical Voter Turnout</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <BarChart data={turnoutData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
              <XAxis dataKey="year" stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#2d3748' }}
                contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568', borderRadius: '8px' }}
                formatter={(value) => [`${value}%`, 'Turnout']}
              />
              <Bar dataKey="turnout" fill="#FF9933" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TimelineTab);
