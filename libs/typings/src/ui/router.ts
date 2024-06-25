import { ApolloClient } from '@apollo/client';

/**
 * Interface defining router context used for dependency injection
 **/

export interface RouterContext {
  apolloClient: ApolloClient<object>;
}

/**
 * Interface defining input params of a function which creates a router instance
 **/
export interface CreateRouter {
  baseRouteName: string;
  apolloClient?: ApolloClient<object>;
}
