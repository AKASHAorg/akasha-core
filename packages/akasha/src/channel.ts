import { getService } from '@akashaproject/sdk-core/lib/utils';
import IDIContainer from '@akashaproject/sdk-runtime/lib/IDIContainer';
import callService from './service-caller';
import { Observable } from 'rxjs';
import { AkashaServicePath } from '@akashaproject/sdk-core/lib/IAkashaModule';

export default function init (di: IDIContainer) {
  // call any registered service and create an Observable
  const send = function(servicePath: AkashaServicePath, payload: object): Observable<any> {
    const service = getService(di, servicePath);
    return callService(service, payload);
  };
  return { send };
}
