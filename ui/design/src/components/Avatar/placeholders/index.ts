const RESOLVED = 'RESOLVED';
const PENDING = 'PENDING';
const REJECTED = 'REJECTED';

// only load the required image
// note that the size of the library is still affected
// if the tree shaking/chunking does not work!
export const loadPlaceholder = (placeholderName: string) => {
  let status = PENDING;
  let result: any;
  let promise;
  switch (placeholderName) {
    case 'placeholder_1':
      promise = import('./placeholder_1');
      return;
    case 'placeholder_2':
      promise = import('./placeholder_2');
      return;
    case 'placeholder_3':
      promise = import('./placeholder_3');
      return;
    case 'placeholder_4':
      promise = import('./placeholder_4');
    case 'placeholder_5':
      promise = import('./placeholder_5');
    case 'placeholder_6':
      promise = import('./placeholder_6');
    case 'placeholder_7':
      promise = import('./placeholder_7');
    default:
      promise = import('./placeholder_1');
  }

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
