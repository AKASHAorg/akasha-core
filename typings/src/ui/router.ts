import { ApolloClient } from '@apollo/client';

export interface RouterContext {
  apolloClient: ApolloClient<object>;
}

export interface CreateRouter {
  baseRouteName: string;
  apolloClient?: ApolloClient<object>;
}
