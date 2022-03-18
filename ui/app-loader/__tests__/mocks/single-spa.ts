export const mountRootParcelMock = jest.fn((loadingFn, props) => {
  return {
    mountPromise: Promise.resolve({ ...props }),
    unmount: () => {
      //TODO:
    },
  };
});
