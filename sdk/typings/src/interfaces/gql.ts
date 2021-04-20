import { ObservableCallResult } from './responses';

// compatible with apollo-link gql request
export interface IGqlOperation {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
  context?: Record<string, unknown>;
  extensions?: Record<string, unknown>;
}

export default interface IGqlClient<Operation> {
  run(operation: IGqlOperation): ObservableCallResult<Operation>;
}
