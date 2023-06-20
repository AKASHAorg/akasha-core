import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnalyticsProvider } from '../use-analytics';
// @TODO remove after replacing old DS components in apps
import ThemeWrapper from './theme-wrapper';

const queryClient = new QueryClient();

/**
 * Higher order component that wraps a component with all necessary providers
 */
export default function withProviders<T>(WrappedComponent: React.ComponentType<T>) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithProviders = props => {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeWrapper {...props}>
          <AnalyticsProvider {...props}>
            <WrappedComponent {...props} />
          </AnalyticsProvider>
        </ThemeWrapper>
      </QueryClientProvider>
    );
  };

  ComponentWithProviders.displayName = `withProviders(${displayName})`;

  return ComponentWithProviders;
}
