import '../jest.setup';

jest.mock('@twind/core', () => {
  return {
    tw: () => {},
    tx: () => {},
    apply: () => {},
  };
});
