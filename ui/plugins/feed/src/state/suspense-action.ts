import * as React from 'react';

export type UpdaterFn = ({ type, payload }: { type: string; payload: any }) => void;

export interface PromiseResolver {
  resolve: () => void;
  promise: Promise<any>;
}

export interface IActionParams {
  type: string;
  [key: string]: any;
}

const createPromiseResolver = () => {
  // tslint:disable-next-line: no-empty
  let resolve: PromiseResolver['resolve'] = () => {};
  const promise: PromiseResolver['promise'] = new Promise(r => (resolve = r));
  return {
    resolve,
    promise,
  };
};

export const useSuspenseAction = (
  updater: UpdaterFn,
  fetcher: (opts: any) => Promise<any>,
  params: IActionParams,
  dependencies?: any,
) => {
  const loading = React.useRef(false);
  const error: { current: Error | null } = React.useRef(null);
  const promiseResolver = React.useMemo<{
    resolve: PromiseResolver['resolve'] | null;
    promise: PromiseResolver['promise'] | null;
  }>(createPromiseResolver, [JSON.stringify(params)]);
  const { type, payload } = params;

  React.useEffect(
    () => {
      // treat an edge case when the hook unmounts
      // before the promise resolves
      let finished = false;

      const runner = () => {
        loading.current = true;
        error.current = null;
        const onFinish = (err: Error | null, data: any) => {
          if (!finished) {
            finished = true;
            error.current = err;
            loading.current = false;
            updater({ type, payload: data });
          }
        };
        Promise.resolve(fetcher(payload))
          .then((res: any) => {
            // @TODO check if the response contains an error key.
            // In this case we must call onFinish with an error param
            /*
          if (res.error) {
            onFinish(new Error(res.error.message), null);
          } else {
            ...
          }
        */
            onFinish(null, res);

            if (typeof promiseResolver.resolve === 'function') {
              return promiseResolver.resolve();
            }
            throw promiseResolver.promise;
          })
          .catch(err => onFinish(err, null));
      };
      runner();
      return () => {
        if (!finished) {
          finished = true;
          error.current = null;
          loading.current = false;
          promiseResolver.promise = null;
          promiseResolver.resolve = null;
        }
      };
      // @TODO: use a proper deep obj comparison library (deepEqual?)
    },
    dependencies ? dependencies : [JSON.stringify(payload)],
  );
  if (loading.current) {
    throw promiseResolver.promise;
  }

  return {
    error: error.current,
    loading: loading.current,
  };
};
