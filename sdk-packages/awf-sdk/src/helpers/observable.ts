import { defer, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObservableCallResult } from '@akashaproject/sdk-typings/lib/interfaces/responses';

export const createObservableValue = <T>(val: T): ObservableCallResult<T> => {
  return defer(() => of({ data: val }));
};

export const createObservableStream = <T>(val: T[] | Promise<T>): ObservableCallResult<T> => {
  return defer(() => from(val).pipe(map(v => ({ data: v }))));
};
