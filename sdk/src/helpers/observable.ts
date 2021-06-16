import { asapScheduler, defer, from, of, scheduled, ObservableInput } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceCallResult } from '@akashaproject/sdk-typings/lib/interfaces';

/**
 * @param val
 * @returns object with data attribute
 */
export const createFormattedValue = <T>(val: T): { data: T } => {
  return { data: val };
};
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
    defer(() =>
      from(val).pipe(
        map(v => {
          return { data: v };
        }),
      ),
    ),
    asapScheduler,
  );
};

export const createObservableStreamGql = <T>(val: ObservableInput<any>): ServiceCallResult<T> => {
  return scheduled(
    defer(() =>
      from(val).pipe(
        map(v => {
          // for graphql error responses
          if (v.errors && v.errors.length) {
            throw v.errors[0];
          }
          // for graphql response data
          if (v.data) {
            return { data: v.data };
          }
          // everything else
          return { data: v };
        }),
      ),
    ),
    asapScheduler,
  );
};
