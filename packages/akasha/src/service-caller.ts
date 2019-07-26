import { defer, Observable } from 'rxjs';

export default function callService (service: Function, payload?: object): Observable<any> {
  return defer(async function() {
    return await service(payload);
  });
}
