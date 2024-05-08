import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WrapperComponent } from '@testing-library/react-hooks';

export const createWrapper = (): [WrapperComponent<React.ReactNode>, QueryClient] => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return [wrapper as WrapperComponent<React.ReactNode>, queryClient];
};
