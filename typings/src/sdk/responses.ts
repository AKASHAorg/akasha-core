import { Observable } from 'rxjs';

export type ServiceCallResult<T> = Observable<{ data: T }>;

export enum PostType {
  DEFAULT,
  ARTICLE,
  APP,
}
