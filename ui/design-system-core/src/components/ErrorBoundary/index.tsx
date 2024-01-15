import React from 'react';
import ErrorLoader, { ErrorLoaderProps } from '../ErrorLoader';
import { ILogger } from '@akashaorg/typings/lib/sdk/log';

export type ErrorBoundaryProps = {
  children: React.ReactElement;
  fallback?: React.ReactElement;
  errorObj?: Pick<ErrorLoaderProps, 'type' | 'title'>;
  logger?: ILogger;
};

export type ErrorBoundaryState = { hasError: boolean; error: Error };

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error: Error): void {
    this.setState({ hasError: true, error });
    this.props.logger?.error(error?.message);
  }

  render() {
    const {
      errorObj: { type = 'script-error', title = 'An error occured' },
      fallback = <ErrorLoader type={type} title={title} details={this.state.error?.message} />,
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
