import * as React from 'react';

const useBodyScrollLock = (): void => {
  React.useLayoutEffect(() => {
    document.body.classList.add('noscroll');
    return () => {
      document.body.classList.remove('noscroll');
    };
  }, []);
};

export default useBodyScrollLock;
