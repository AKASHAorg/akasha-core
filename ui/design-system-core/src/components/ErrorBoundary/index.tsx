import React from 'react';
import ErrorLoader, { ErrorLoaderProps } from '../ErrorLoader';

export type ErrorBoundaryProps = {
  children: React.ReactElement;
  fallback?: React.ReactElement;
  errorObj?: Pick<ErrorLoaderProps, 'type' | 'title' | 'details'>;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const {
      errorObj: { type = 'script-error', title = 'An error occured', details = '' },
      fallback = <ErrorLoader type={type} title={title} details={details} />,
      children,
    } = this.props;

    if (this.state.hasError) {
      return fallback;
    }

    return children;
  }
}

export const withErrorBoundary =
  <T extends ErrorBoundaryProps>(WrappedComponent: React.ComponentType<T>) =>
  (props: T) => {
    const { fallback } = props;

    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };

export default ErrorBoundary;
