import { AkashaServicePath } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { callServiceMethod, toCurried } from '@akashaproject/sdk-core/lib/utils';
import IDIContainer from '@akashaproject/sdk-runtime/lib/IDIContainer';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import callChannelService from './service-caller';

// keep last 42 emitted values for 15s
export const globalChannel = new ReplaySubject(42, 15000);

export default function init(di: IDIContainer): any {
  const invoke = callServiceMethod(di);
  // call any registered service and create an Observable
  const send = (
    servicePath: AkashaServicePath,
    method: string,
    args: Record<string, unknown>,
  ): Observable<any> => {
    const service: any = invoke(servicePath)(method);
    const obsSource = callChannelService(service, args);
    const obs = obsSource.pipe(
      map(result => {
        const data = Object.assign(
          {
            channelInfo: {
              servicePath,
              method,
              args,
            },
          },
          { data: result },
        );
        // global channel never throws errors
        globalChannel.next(data);
        return data;
      }),
    );
    return obs;
  };
  return toCurried(send);
}
