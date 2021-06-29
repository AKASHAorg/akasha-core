// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockImport = importName => {
  return Promise.resolve({});
};

global.fetch = jest.fn(() => Promise.resolve({ json: () => '' }));
global.System = {
  import: jest.fn(mockImport),
};
