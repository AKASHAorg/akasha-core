import { ServiceCallResult } from './responses';
import { GraphQLRequest } from '@apollo/client/link/core/types';

interface IGqlClient<Operation> {
  run(operation: GraphQLRequest): ServiceCallResult<Operation>;
}

export default IGqlClient;
