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

/**
 * An ErrorBoundary serves the purpose of catching and displaying errors
 * when a component fails to load.
 * @param children - the component that needs to load
 * @param fallback - (optional) fallback component when error occurs
 * @param errorObj - (optional) object containing the error message and type
 * @param logger - (optional) log to the console if provided
 * @example
 * ```tsx
 *  <ErrorBoundary>
 *      errorObj={{
 *               type: 'script-error',
 *               title: t('Error in loading reflection.'),
 *               }}
 *   >
 *    <SomeChildComponent />
 * </ErrorBoundary>
 * ```
 **/
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
