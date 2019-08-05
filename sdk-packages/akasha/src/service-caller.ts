import { defer, Observable } from 'rxjs';

// service consumer
export default function callService(
  service: (payload?: object) => any,
  payload?: object
): Observable<any> {
  return defer(async () => {
    return service(payload);
  });
}
