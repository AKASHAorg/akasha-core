import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

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
    ({ children }) => (
      <QueryClientProvider contextSharing={true} client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
    queryClient,
  ];
};
