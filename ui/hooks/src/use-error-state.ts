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
  getFilteredErrors: (filterKey: string) => { [key: string]: IAkashaError };
}
const useErrorState = (props: UseErrorStateProps): [ErrorState, ErrorActions] => {
  const { logger } = props;
  const [errors, setErrors] = React.useState<ErrorState>({});

  const actions: ErrorActions = {
    createError(err) {
      if (logger) {
        logger.error(err);
      }
      if (!errors[err.errorKey]) {
        setErrors(prev => ({ [err.errorKey]: err, ...prev }));
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
        // target keys that are from useGetState
        // @TODO: make this constants and build the keys using them like
        // `${CONSTANT_LOGIN}`.methodName.context
        const errorKeys = Object.keys(prev).filter(key => {
          const errorKey = key.split('.')[0];
          return errorKey === 'useGetLogin' || errorKey === 'useLogin';
        });
        const newErrors = { ...prev };
        errorKeys.forEach(key => {
          delete newErrors[key];
        });
        return newErrors;
      });
    },
    getFilteredErrors(filterKey) {
      return Object.keys(errors)
        .filter(k => k.startsWith(filterKey))
        .reduce((obj, key) => ({ ...obj, [key]: errors[key] }), {});
    },
  };
  return [errors, actions];
};

export default useErrorState;
