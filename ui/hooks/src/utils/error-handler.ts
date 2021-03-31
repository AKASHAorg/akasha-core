import { IAkashaError } from '@akashaproject/ui-awf-typings';

export const createErrorHandler = (
  errorKey: string,
  critical?: boolean,
  onError?: (errorObj: IAkashaError) => void,
) => (err: Error) => {
  if (onError) {
    onError({
      errorKey,
      error: err,
      critical: critical || false,
    });
  }
};
