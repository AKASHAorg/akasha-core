require('@testing-library/jest-dom/extend-expect');

jest.mock('@twind/core', () => {
  return {
    tw: () => {},
    tx: () => {},
    apply: () => {},
  };
});
