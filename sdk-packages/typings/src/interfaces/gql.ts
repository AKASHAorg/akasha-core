import { ObservableCallResult } from './basic';

// compatible with apollo-link gql request
export interface IGqlOperation {
  query: string;
  variables?: object;
  operationName?: string;
  context?: object;
  extensions?: object;
}

export default interface IGqlClient {
  run(operation: IGqlOperation): ObservableCallResult<any>;
}
