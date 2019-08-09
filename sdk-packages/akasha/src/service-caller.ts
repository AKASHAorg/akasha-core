import { AkashaServiceMethods } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { asapScheduler, defer, Observable, scheduled } from 'rxjs';

// service consumer
export default function callService(
  service: AkashaServiceMethods,
  payload: object
): Observable<any> {
  return defer(() => {
    return scheduled([service(payload)], asapScheduler);
  });
}
