import React from 'react';
import PropTypes from 'prop-types';

/**
 * Loading spinner component.
 * @param {Object} props Component props.
 * @param {string} [props.size='md'] Size of the spinner ('sm', 'md', 'lg').
 * @param {string} [props.text='Loading...'] Text to display below spinner.
 * @returns {JSX.Element} LoadingSpinner component.
 */
const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4" role="status" aria-busy="true" aria-label="Loading">
      <div className={`${sizeClasses[size]} border-4 border-gray-700 border-t-saffron rounded-full animate-spin`} />
      {text && <p className="text-gray-400 font-medium text-sm">{text}</p>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  text: PropTypes.string
};

LoadingSpinner.defaultProps = {
  size: 'md',
  text: 'Loading...'
};

export default LoadingSpinner;
