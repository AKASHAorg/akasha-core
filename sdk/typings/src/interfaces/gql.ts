import { ServiceCallResult } from './responses';
import { GraphQLRequest } from '@apollo/client/link/core/types';

export default interface IGqlClient<Operation> {
  run(operation: GraphQLRequest): ServiceCallResult<Operation>;
}
