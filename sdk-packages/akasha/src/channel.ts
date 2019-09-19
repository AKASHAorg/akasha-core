import { AkashaServicePath } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { callServiceMethod, toCurried } from '@akashaproject/sdk-core/lib/utils';
import IDIContainer from '@akashaproject/sdk-runtime/lib/IDIContainer';
import { Observable } from 'rxjs';
import callChannelService from './service-caller';

// @Todo: document this magical code @_@
export default function init(di: IDIContainer): any {
  const invoke = callServiceMethod(di);
  // call any registered service and create an Observable
  const send = (servicePath: AkashaServicePath, method: string, args: object): Observable<any> => {
    // @Todo: handle unresolved methods
    const service = invoke(servicePath)(method);
    return callChannelService(service, args);
  };
  return { send: toCurried(send) };
}
