import { IAkashaError } from '@akashaorg/ui-awf-typings';
import { ILogger } from '@akashaorg/sdk-typings/lib/interfaces/log';
import getSDK from '@akashaorg/awf-sdk';

const logger = new Map<string, ILogger>();

export const getLogger = (name: string) => {
  if (!logger.has(name)) {
    const sdk = getSDK();
    logger.set(name, sdk.services.log.create(name));
  }
  return logger.get(name);
};

export const logError = (name: string, errorInfo: Error) => {
  getLogger(name).error(errorInfo.message);
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
