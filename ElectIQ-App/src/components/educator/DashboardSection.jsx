import React from 'react';
import PropTypes from 'prop-types';
import { GOOGLE_SERVICES } from '../../config/googleServices';
import { CheckCircle2 } from 'lucide-react';

/**
 * Dashboard section for educator portal.
 * @param {Object} props Component props.
 * @param {Object} props.stats Statistics object.
 * @returns {JSX.Element} DashboardSection component.
 */
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

DashboardSection.propTypes = {
  stats: PropTypes.shape({
    questions: PropTypes.number.isRequired,
    popularQuiz: PropTypes.string,
    sessions: PropTypes.number.isRequired,
    recentList: PropTypes.array
  }).isRequired
};

DashboardSection.defaultProps = {
  stats: {
    questions: 0,
    popularQuiz: 'Basic',
    sessions: 0,
    recentList: []
  }
};

export default React.memo(DashboardSection);
