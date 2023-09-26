import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnalyticsProvider } from '../use-analytics';
import { RootComponentProps } from '@akashaorg/typings/lib/ui';
import { RootComponentPropsProvider } from '../use-root-props';

const queryClient = new QueryClient();

/**
 * Higher order component that wraps a component with all necessary providers
 */
export const withProviders = <T extends RootComponentProps>(
  WrappedComponent: React.ComponentType<T>,
) => {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'WrappedHOComponent';

  const ComponentWithProviders = (props: T) => {
    return (
      <QueryClientProvider client={queryClient}>
        <AnalyticsProvider {...props}>
          <RootComponentPropsProvider {...props}>
            <WrappedComponent {...props} />
          </RootComponentPropsProvider>
        </AnalyticsProvider>
      </QueryClientProvider>
    );
  };

  ComponentWithProviders.displayName = `withProviders(${displayName})`;

  return ComponentWithProviders;
};
