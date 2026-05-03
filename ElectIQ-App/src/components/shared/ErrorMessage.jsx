import React from 'react';
import PropTypes from 'prop-types';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  return (
    <div role="alert" className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3">
      <AlertCircle className="text-red-500 shrink-0" />
      <p className="text-red-400 font-medium text-sm">{message}</p>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
};

export default ErrorMessage;
