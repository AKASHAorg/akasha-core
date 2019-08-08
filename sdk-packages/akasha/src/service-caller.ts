import { AkashaServiceMethods } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { invokeServiceMethod } from '@akashaproject/sdk-core/lib/utils';
import { asapScheduler, defer, Observable, scheduled } from 'rxjs';

// service consumer
export default function callService(
  service: AkashaServiceMethods,
  payload: { method: string; args: object }
): Observable<any> {
  return defer(() => {
    const method = invokeServiceMethod(payload.method);
    return scheduled([method(payload.args, service)], asapScheduler);
  });
}
