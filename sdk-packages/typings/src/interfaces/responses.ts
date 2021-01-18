import { Observable } from 'rxjs';

export interface ServiceCallResult<T> {
  data: T;
}

export type ObservableCallResult<T> = Observable<ServiceCallResult<T>>;
