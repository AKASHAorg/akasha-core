
const genMockOp = (payload?: {}) => {
  return jest.fn().mockImplementation((cb) => {
    if (cb && payload) {
      return cb(payload);
    }
  });
};

export { genMockOp }
