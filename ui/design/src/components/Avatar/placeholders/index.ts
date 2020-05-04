const RESOLVED = 'RESOLVED';
const PENDING = 'PENDING';
const REJECTED = 'REJECTED';

// only load the required image
// note that the size of the library is still affected
// if the tree shaking/chunking does not work!
export const loadPlaceholder = (placeholderName: string) => {
  let status = PENDING;
  let result: string;
  let promise: Promise<any>;
  switch (placeholderName) {
    case 'placeholder_1':
      promise = import('./placeholder_1');
      break;
    case 'placeholder_2':
      promise = import('./placeholder_2');
      break;
    case 'placeholder_3':
      promise = import('./placeholder_3');
      break;
    case 'placeholder_4':
      promise = import('./placeholder_4');
      break;
    case 'placeholder_5':
      promise = import('./placeholder_5');
      break;
    case 'placeholder_6':
      promise = import('./placeholder_6');
      break;
    case 'placeholder_7':
      promise = import('./placeholder_7');
      break;
    default:
      promise = import('./placeholder_1');
  }

  const suspender = promise
    .then(res => {
      status = RESOLVED;
      result = res.default;
    })
    .catch(err => {
      status = REJECTED;
      result = err;
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
      }
    },
  };
};
