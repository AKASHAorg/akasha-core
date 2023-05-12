import * as React from 'react';
import DS from '@akashaorg/design-system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnalyticsProvider } from '../use-analytics';
import ThemeWrapper from './theme-wrapper';

const { ViewportSizeProvider } = DS;

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
            <ViewportSizeProvider>
              <WrappedComponent {...props} />
            </ViewportSizeProvider>
          </AnalyticsProvider>
        </ThemeWrapper>
      </QueryClientProvider>
    );
  };

  ComponentWithProviders.displayName = `withProviders(${displayName})`;

  return ComponentWithProviders;
}
