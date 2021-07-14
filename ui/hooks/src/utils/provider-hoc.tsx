import * as React from 'react';
import DS from '@akashaproject/design-system';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const { ThemeSelector, lightTheme, darkTheme } = DS;

const queryClient = new QueryClient();

export default function withProviders<T>(WrappedComponent: React.ComponentType<T>) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithProviders = props => {
    return (
      <>
        <QueryClientProvider client={queryClient}>
          <ThemeSelector
            settings={{ activeTheme: 'Light-Theme' }}
            availableThemes={[lightTheme, darkTheme]}
          >
            <WrappedComponent {...props} />
          </ThemeSelector>
          <ReactQueryDevtools position={'bottom-right'} />
        </QueryClientProvider>
      </>
    );
  };

  ComponentWithProviders.displayName = `withProviders(${displayName})`;

  return ComponentWithProviders;
}
