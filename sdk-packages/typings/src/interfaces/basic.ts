import { Observable } from 'rxjs';

export interface ServiceCallResult<T> {
  data: T;
  info?: { method?: string; args?: any };
  error?: Error;
}

export type ObservableCallResult<T> = Observable<ServiceCallResult<T>>;
