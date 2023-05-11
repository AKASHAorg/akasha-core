import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });
  return [
    ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
    queryClient,
  ];
};
