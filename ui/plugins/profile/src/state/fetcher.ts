export interface IFetcherOptions {
  service: () => Promise<any>;
  dispatch: (payload: any) => void;
}

const ServiceStatus = {
  PENDING: 0,
  RESOLVED: 1,
  REJECTED: 2,
};

const dispatchWhenResolved = (service: any, dispatch: any) => {
  let status = ServiceStatus.PENDING;
  let error;
  const suspender = service().then(
    (resp: any) => {
      status = ServiceStatus.RESOLVED;
      dispatch({ ...resp });
    },
    (err: Error) => {
      status = ServiceStatus.REJECTED;
      error = err;
    },
  );

  return {
    status,
    value: suspender,
  };
};

/**
 * a fetcher that works with React.Suspense
 * to be used in actions (actions must return a call to this function)
 *
 * Usage:
 * ```jsx
 * const MyComponent = () => {
 * const myFetchAction = fetchSomething(...payload);
 *  return (
 *    <React.Suspense fallback={<>Loading Data</>}>
 *      <MyComponentThatNeedsData myFetchAction={myFetchAction} />
 *    </React.Suspense>
 *  )
 * }
 * ```
 *
 * and then in `MyComponentThatNeedsData` you can call `myFetchAction.run();`;
 * -> no worries, by the time you call run() the data will be in state;
 *
 */
export const suspendFetcher = (opts: IFetcherOptions) => {
  const { service, dispatch } = opts;
  let status = ServiceStatus.PENDING;
  let result: any;
  const suspender = service().then(
    res => {
      status = ServiceStatus.RESOLVED;
      result = res;
    },
    err => {
      status = ServiceStatus.REJECTED;
      result = err;
    },
  );
  return {
    run: () => {
      switch (status) {
        case ServiceStatus.PENDING:
          throw suspender;
        case ServiceStatus.REJECTED:
          throw status;
        case ServiceStatus.RESOLVED:
          dispatch({ ...result });
          return undefined;
        default:
          return undefined;
      }
    },
  };
};

// a convenient function to dispatch all the actions passed
// @TODO: can we pass the whole props obj and dispatch all props with `typeof props[key].dispatch === function`?

export const autoDispatch = (actions: [{ run: () => {} }]) => {
  actions.forEach(action => action.run());
};
