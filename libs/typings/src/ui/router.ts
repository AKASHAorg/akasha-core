import { ApolloClient } from '@apollo/client';

/**
 * Interface defining router context used for dependency injection
 **/

export interface IRouterContext {
  apolloClient: ApolloClient<object>;
}

/**
 * Interface defining input params of a function which creates a router instance
 **/
export interface ICreateRouter {
  baseRouteName: string;
  apolloClient?: ApolloClient<object>;
}
