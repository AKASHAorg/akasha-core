import { ApolloClient } from '@apollo/client';

export interface RouterContext {
  apolloClient: ApolloClient<object>;
  authenticatedDID?: string;
}

export interface CreateRouter {
  baseRouteName: string;
  apolloClient?: ApolloClient<object>;
  authenticatedDID?: string;
}
