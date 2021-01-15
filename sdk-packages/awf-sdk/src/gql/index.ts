import { injectable } from 'inversify';
import IGqlClient, { IGqlOperation } from '@akashaproject/sdk-typings/lib/interfaces/gql';
import { ObservableCallResult } from '@akashaproject/sdk-typings/lib/interfaces/basic';

@injectable()
class Gql implements IGqlClient {
  run(operation: IGqlOperation): ObservableCallResult<any> {
    return undefined;
  }
}

export { Gql };
