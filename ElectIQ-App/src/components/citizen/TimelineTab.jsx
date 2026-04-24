import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Share2, CheckCircle2, CircleDot, Circle } from 'lucide-react';

const turnoutData = [
  { year: '1952', turnout: 45.7 },
  { year: '1977', turnout: 60.5 },
  { year: '1999', turnout: 59.9 },
  { year: '2014', turnout: 66.4 },
  { year: '2019', turnout: 67.4 },
  { year: '2024', turnout: 65.8 },
];

const timelineSteps = [
  { id: 1, title: "Election Commission Announcement", desc: "ECI announces the schedule, dates, and phases of the upcoming election.", rule: "Must be announced well in advance", duration: "1 day", status: 'completed' },
  { id: 2, title: "Model Code of Conduct Begins", desc: "Immediate effect after announcement. Guidelines for political parties and candidates.", rule: "Govt cannot announce new projects", duration: "Until results", status: 'completed' },
  { id: 3, title: "Voter List Finalization", desc: "Updating the electoral roll, adding new voters, removing deceased.", rule: "Cutoff date usually before nomination", duration: "Continuous", status: 'completed' },
  { id: 4, title: "Nomination Filing (Form 2B)", desc: "Candidates file their nomination papers along with an affidavit.", rule: "Must disclose assets and criminal records", duration: "7 days", status: 'current' },
  { id: 5, title: "Scrutiny of Nominations", desc: "Returning Officer checks the validity of the filed nomination papers.", rule: "Can be rejected for incomplete info", duration: "1-2 days", status: 'upcoming' },
  { id: 6, title: "Withdrawal of Candidature", desc: "Candidates can voluntarily withdraw their names from the contest.", rule: "Notice must be given in writing", duration: "2 days", status: 'upcoming' },
  { id: 7, title: "Campaign Period", desc: "Parties and candidates campaign to win over voters.", rule: "Strict expenditure limits apply", duration: "14-21 days", status: 'upcoming' },
  { id: 8, title: "Campaign Silence Period", desc: "All public campaigning must stop 48 hours before polling begins.", rule: "Section 126 of RPA 1951", duration: "48 hours", status: 'upcoming' },
  { id: 9, title: "Polling Day", desc: "Voters cast their vote using Electronic Voting Machines (EVMs).", rule: "Requires Voter ID or approved document", duration: "1 day (per phase)", status: 'upcoming' },
  { id: 10, title: "EVM Sealing & Storage", desc: "EVMs are sealed and transported to secure strong rooms under guard.", rule: "Accompanied by party agents", duration: "1-2 days", status: 'upcoming' },
  { id: 11, title: "Vote Counting", desc: "Votes are counted transparently under the supervision of the Returning Officer.", rule: "VVPAT matching can happen", duration: "1 day", status: 'upcoming' },
  { id: 12, title: "Result Declaration & Oath", desc: "ECI publishes final results, and winning candidates are issued certificates.", rule: "Marks the end of the election process", duration: "Immediate", status: 'upcoming' },
];

const TimelineStep = React.memo(({ step, isExpanded, onToggle }) => {
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
      <div className="absolute left-0 top-0 bg-dark-bg p-0.5 rounded-full z-10" onClick={onToggle}>
        {getIcon()}
      </div>

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
              <p className="text-sm text-gray-400 mb-3">{step.desc}</p>
              
              <div className="bg-saffron/10 border border-saffron/30 rounded p-3 mb-3 flex gap-2 items-start">
                <Info size={16} className="text-saffron shrink-0 mt-0.5" />
                <p className="text-xs text-saffron font-medium">Key Rule: {step.rule}</p>
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

const TimelineTab = () => {
  const [expandedId, setExpandedId] = useState(4); // default expanded is the current one

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="text-2xl font-bold font-heading mb-2">Election Journey</h2>
        <p className="text-gray-400 text-sm">Follow the 12 critical steps of an Indian election.</p>
      </div>

      <div className="bg-dark-card border border-gray-800 rounded-xl p-4">
        {timelineSteps.map((step) => (
          <TimelineStep 
            key={step.id} 
            step={step} 
            isExpanded={expandedId === step.id}
            onToggle={() => setExpandedId(expandedId === step.id ? null : step.id)}
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

export default TimelineTab;
