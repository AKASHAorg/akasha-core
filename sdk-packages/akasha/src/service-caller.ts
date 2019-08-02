import { defer, Observable } from 'rxjs';

// service consumer
export default function callService (service: Function, payload?: object): Observable<any> {
  return defer(async function() {
    return service(payload);
  });
}
