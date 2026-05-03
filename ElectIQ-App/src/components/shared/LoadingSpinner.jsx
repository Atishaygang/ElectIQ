import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4" role="status" aria-busy="true">
      <div className={`${sizeClasses[size]} border-4 border-gray-700 border-t-saffron rounded-full animate-spin`} />
      {text && <p className="text-gray-400 font-medium text-sm">{text}</p>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  text: PropTypes.string
};

export default LoadingSpinner;
