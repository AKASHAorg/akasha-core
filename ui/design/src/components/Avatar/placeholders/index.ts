const RESOLVED = 'RESOLVED';
const PENDING = 'PENDING';
const REJECTED = 'REJECTED';

// only load the required image
// note that the size of the library is still affected
// if the tree shaking/chunking does not work!

export const loadPlaceholder = (placeholderName: string) => {
  let status = PENDING;
  let result;
  const promise = import(`./${placeholderName}`);
  const suspender = promise
    .then(r => {
      status = RESOLVED;
      result = r.default;
    })
    .catch(e => {
      status = REJECTED;
      result = e;
    });

  return {
    read: () => {
      switch (status) {
        case PENDING:
          throw suspender;
        case REJECTED:
          throw result;
        case RESOLVED:
          return result;
        default:
          return undefined;
      }
    },
  };
};
