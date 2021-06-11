import { injectable } from 'inversify';
import IGqlClient, { IGqlOperation } from '@akashaproject/sdk-typings/lib/interfaces/gql';
import { ObservableCallResult } from '@akashaproject/sdk-typings/lib/interfaces';

@injectable()
class Gql implements IGqlClient<unknown> {
  run(operation: IGqlOperation): ObservableCallResult<unknown> {
    return undefined;
  }
}

export { Gql };
