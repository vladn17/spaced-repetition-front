import * as React from 'react';
import InfoMessage from '../InfoMessage';

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  render() {
    if (this.state.hasError) {
      return <InfoMessage>Something went wrong</InfoMessage>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
