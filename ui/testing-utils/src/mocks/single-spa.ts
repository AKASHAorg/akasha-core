export const mountRootParcelMock = jest.fn((loadingFn, props) => {
  return {
    mountPromise: Promise.resolve({ ...props }),
    unmount: () => {
      //TODO:
    },
  };
});

export const getAppNames = jest.fn((names: string[]) => {
  return names;
});

export const unregisterApplication = jest.fn(() => {
  return Promise.resolve();
});

export const getSingleSpaInstanceMock = () => {
  let appNames = [];
  return {
    appNames,
    getAppNames: jest.fn(() => appNames),
    setAppNames: names => {
      appNames = names;
    },
    registerApplication: jest.fn(props => {
      appNames = appNames.concat(props.name);
    }),
    unregisterApplication: jest.fn(() => Promise.resolve()),
    mountRootParcel: jest.fn((loadingFn, props) => {
      return {
        mountPromise: Promise.resolve({ ...props }),
        unmount: () => {
          //TODO:
        },
      };
    }),
  };
};

export const genLifecycles = (overrides?: {
  mount?: () => Promise<void>;
  unmount?: () => Promise<void>;
  bootstrap?: () => Promise<void>;
}) => {
  return Promise.resolve({
    mount: () => {
      return Promise.resolve();
    },
    unmount: () => {
      return Promise.resolve();
    },
    bootstrap: () => {
      return Promise.resolve();
    },
    ...overrides,
  });
};
