import { AkashaServicePath } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { getService } from '@akashaproject/sdk-core/lib/utils';
import IDIContainer from '@akashaproject/sdk-runtime/lib/IDIContainer';
import { Observable } from 'rxjs';
import callService from './service-caller';
import { SendChannel } from './utils';

export default function init(di: IDIContainer) {
  // call any registered service and create an Observable
  const send: SendChannel = (servicePath: AkashaServicePath, payload: object): Observable<any> => {
    const service = getService(di, servicePath);
    return callService(service, payload);
  };
  return { send };
}
