import { asapScheduler, defer, from, of, scheduled, ObservableInput } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceCallResult } from '@akashaorg/typings/sdk';

/**
 * @param val - Data value
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

export function toPromise<R>(observable: any): Promise<R> {
  let completed = false;
  return new Promise<R>((resolve, reject) => {
    observable.subscribe({
      next: data => {
        if (completed) {
          console.warn(`Promise Wrapper does not support multiple results from Observable`);
        } else {
          completed = true;
          resolve(data);
        }
      },
      error: reject,
    });
  });
}
