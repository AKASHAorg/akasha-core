import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import getSDK from '@akashaproject/awf-sdk';

const logger = new Map<string, ILogger>();

export const getLogger = (name: string) => {
  if (!logger.has(name)) {
    const sdk = getSDK();
    logger.set(name, sdk.services.log.create(name));
  }
  return logger.get(name);
};

export const logError = (name: string, errorInfo: IAkashaError) => {
  getLogger(name).error(errorInfo.error.message);
};

export const createErrorHandler =
  (errorKey: string, critical?: boolean, onError?: (errorObj: IAkashaError) => void) =>
  (err: Error) => {
    if (onError) {
      onError({
        errorKey,
        error: err,
        critical: critical || false,
      });
    }
  };
