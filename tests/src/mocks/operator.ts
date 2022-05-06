const genMockOp = (payload?: Record<string, unknown>) => {
  return jest.fn().mockImplementation(cb => {
    if (cb && payload) {
      return cb(payload);
    }
  });
};

export { genMockOp };
