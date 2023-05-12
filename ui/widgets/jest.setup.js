jest.mock('@twind/core', () => {
  return {
    tw: () => ({}),
    apply: () => ({}),
  };
});
