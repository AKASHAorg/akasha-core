import { asapScheduler, defer, Observable, scheduled } from 'rxjs';
import { multicast, refCount } from 'rxjs/operators';

// service consumer
export default function callService(service: any, payload: object): Observable<any> {
  return defer(() => {
    const subject = scheduled(service(payload), asapScheduler);
    // emit
    // const multicasted = source.pipe(multicast(subject));
    return subject;
  });
}
