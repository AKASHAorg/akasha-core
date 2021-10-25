import * as React from 'react';
import DS from '@akashaproject/design-system';
import { QueryClient, QueryClientProvider } from 'react-query';

const { ThemeSelector, lightTheme, darkTheme, ViewportSizeProvider } = DS;

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

export default function withProviders<T>(WrappedComponent: React.ComponentType<T>) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithProviders = props => {
    return (
      <>
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ThemeSelector
            settings={{ activeTheme: 'Light-Theme' }}
            availableThemes={[lightTheme, darkTheme]}
          >
            <ViewportSizeProvider>
              <WrappedComponent {...props} />
            </ViewportSizeProvider>
          </ThemeSelector>
        </QueryClientProvider>
      </>
    );
  };

  ComponentWithProviders.displayName = `withProviders(${displayName})`;

  return ComponentWithProviders;
}
