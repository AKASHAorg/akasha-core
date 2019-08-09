import { AkashaServicePath } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { callServiceMethod } from '@akashaproject/sdk-core/lib/utils';
import IDIContainer from '@akashaproject/sdk-runtime/lib/IDIContainer';
import { Observable } from 'rxjs';
import callChannelService from './service-caller';
import { SendChannel } from './utils';

export default function init(di: IDIContainer) {
  const invoke = callServiceMethod(di);
  // call any registered service and create an Observable
  const send: SendChannel = (
    servicePath: AkashaServicePath,
    payload: { method: string; args: object }
  ): Observable<any> => {
    const service = invoke(servicePath)(payload.method);
    return callChannelService(service, payload.args);
  };
  return { send };
}
