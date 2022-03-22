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

export const installSingleSpaMock = () => {
  return jest.mock('single-spa', () => {
    return {
      registerApplication: jest.fn(),
      getAppNames: jest.fn((names: string[]) => names),
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
  });
};
