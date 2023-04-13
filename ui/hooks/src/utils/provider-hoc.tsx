import * as React from 'react';
import DS from '@akashaorg/design-system';
import {
  QueryClient as DeprecatedQueryClient,
  QueryClientProvider as DeprecatedQueryClientProvider,
} from 'react-query';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnalyticsProvider } from '../use-analytics';
import ThemeWrapper from './theme-wrapper';

const { ViewportSizeProvider } = DS;

const deprecatedQueryClient = new DeprecatedQueryClient({
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

// const queryClient = new QueryClient();

/**
 * Higher order component that wraps a component with all necessary providers
 */
export default function withProviders<T>(WrappedComponent: React.ComponentType<T>) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithProviders = props => {
    return (
      <>
        <DeprecatedQueryClientProvider contextSharing={true} client={deprecatedQueryClient}>
          {/*<QueryClientProvider contextSharing={true} client={queryClient}>*/}
          <ThemeWrapper {...props}>
            <AnalyticsProvider {...props}>
              <ViewportSizeProvider>
                <WrappedComponent {...props} />
              </ViewportSizeProvider>
            </AnalyticsProvider>
          </ThemeWrapper>
          {/*</QueryClientProvider>*/}
        </DeprecatedQueryClientProvider>
      </>
    );
  };

  ComponentWithProviders.displayName = `withProviders(${displayName})`;

  return ComponentWithProviders;
}
