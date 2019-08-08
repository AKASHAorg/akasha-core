import { AkashaServicePath } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { callService } from '@akashaproject/sdk-core/lib/utils';
import IDIContainer from '@akashaproject/sdk-runtime/lib/IDIContainer';
import { Observable } from 'rxjs';
import callChannelService from './service-caller';
import { SendChannel } from './utils';

export default function init(di: IDIContainer) {
  const invoke = callService(di);
  // call any registered service and create an Observable
  const send: SendChannel = (
    servicePath: AkashaServicePath,
    payload: { method: string; args: object }
  ): Observable<any> => {
    const service = invoke(servicePath);
    return callChannelService(service, payload);
  };
  return { send };
}
