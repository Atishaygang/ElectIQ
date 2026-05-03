import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

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
            {stats.recentList && stats.recentList.length === 0 ? <p className="text-gray-500">No questions yet</p> : 
              stats.recentList?.map((q, i) => (
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

AnalyticsSection.propTypes = {
  stats: PropTypes.shape({
    recentList: PropTypes.array
  }).isRequired
};

export default React.memo(AnalyticsSection);
