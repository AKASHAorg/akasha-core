import { asapScheduler, defer, from, of, scheduled, ObservableInput } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceCallResult } from '@akashaproject/sdk-typings/lib/interfaces';

/**
 * Transform a single value response to an observable source
 * @param val - Value to be transformed into observable source
 */
export const createObservableValue = <T>(val: T): ServiceCallResult<T> => {
  return scheduled(
    defer(() => of({ data: val })),
    asapScheduler,
  );
};

/**
 * Transform a stream of values into objects
 * @param val - Iterable value to be transformed into observable source
 */
export const createObservableStream = <T>(val: ObservableInput<T>): ServiceCallResult<T> => {
  return scheduled(
    defer(() => from(val).pipe(map(v => ({ data: v })))),
    asapScheduler,
  );
};
