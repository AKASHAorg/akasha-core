import { IAkashaError } from '@akashaproject/ui-awf-typings';
import React from 'react';

export interface UseErrorStateProps {
  logger: any;
}
export interface ErrorState {
  [key: string]: IAkashaError;
}
export interface ErrorActions {
  createError: (err: IAkashaError) => void;
  removeError: (errorKey: string) => void;
  removeLoginErrors: () => void;
}
const useErrorState = (props: UseErrorStateProps): [ErrorState, ErrorActions] => {
  const { logger } = props;
  const [errors, setErrors] = React.useState<ErrorState>({});

  const actions: ErrorActions = {
    createError(err) {
      logger.error(err);
      if (!errors[err.errorKey]) {
        setErrors({ [err.errorKey]: err });
      }
    },
    removeError(errorKey) {
      setErrors(prev => {
        const newError = { ...prev };
        delete newError[errorKey];
        return newError;
      });
    },
    removeLoginErrors() {
      setErrors(prev => {
        // target keys that are from useLoginState
        // @TODO: make this constants and build the keys using them like
        // `${CONSTANT_LOGIN}`.methodName.context
        const errorKeys = Object.keys(prev).filter(key => key.split('.')[0] === 'useLoginState');
        const newErrors = { ...prev };
        errorKeys.forEach(key => {
          delete newErrors[key];
        });
        return newErrors;
      });
    },
  };
  return [errors, actions];
};

export default useErrorState;
