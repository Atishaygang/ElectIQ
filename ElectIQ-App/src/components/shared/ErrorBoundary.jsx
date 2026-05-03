import React from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';
import { logger } from '../../utils/logger';

/**
 * ErrorBoundary catches JavaScript errors anywhere in their child component tree.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      logger.error("ErrorBoundary caught an error", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorMessage message="Something went wrong while rendering this component." />;
    }

    return this.props.children; 
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node
};

ErrorBoundary.defaultProps = {
  fallback: null
};

export default ErrorBoundary;
