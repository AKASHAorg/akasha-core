import { asapScheduler, defer, from, Observable, scheduled } from 'rxjs';

// service consumer
export default function callService(service: any, payload: object): Observable<any> {
  return defer(() => {
    return scheduled(from(service(payload)), asapScheduler);
  });
}
