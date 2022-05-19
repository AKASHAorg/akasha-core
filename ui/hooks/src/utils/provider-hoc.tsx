import * as React from 'react';
import DS from '@akashaorg/design-system';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AnalyticsProvider } from '../use-analytics';
import ThemeWrapper from './theme-wrapper';

const { ViewportSizeProvider } = DS;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      notifyOnChangePropsExclusions: ['isStale'],
      staleTime: 6000,
      initialDataUpdatedAt: Date.now() - 6000,
      refetchOnWindowFocus: true,
      notifyOnChangeProps: 'tracked',
      refetchOnMount: true,
    },
  },
});

/**
 * Higher order component that wraps a component with all necessary providers
 * @param WrappedComponent - component to be wrapped
 */
export default function withProviders<T>(WrappedComponent: React.ComponentType<T>) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithProviders = props => {
    return (
      <>
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ThemeWrapper {...props}>
            <AnalyticsProvider {...props}>
              <ViewportSizeProvider>
                <WrappedComponent {...props} />
              </ViewportSizeProvider>
            </AnalyticsProvider>
          </ThemeWrapper>
        </QueryClientProvider>
      </>
    );
  };

  ComponentWithProviders.displayName = `withProviders(${displayName})`;

  return ComponentWithProviders;
}
