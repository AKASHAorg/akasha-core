import { useApolloClient } from '@apollo/client';

export type ApolloClient = ReturnType<typeof useApolloClient>;

export interface RouterContext {
  apolloClient: ApolloClient;
}

export interface CreateRouter {
  baseRouteName: string;
  apolloClient?: ApolloClient;
}
