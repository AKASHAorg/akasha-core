import getSDK from '@akashaorg/awf-sdk';
import { Logger } from '@akashaorg/awf-sdk';

const logger = new Map<string, Logger>();

/**
 * Utility to get a logger from a map of loggers
 */
export const getLogger = (name: string) => {
  if (!logger.has(name)) {
    const sdk = getSDK();
    logger.set(name, sdk.services.log.create(name));
  }
  return logger.get(name);
};

/**
 * Utility to log error to a specified logger
 */
export const logError = (name: string, errorInfo: Error) => {
  getLogger(name).error(errorInfo.message);
};

/**
 * Utility to handle error
 */
export const createErrorHandler =
  (errorKey: string, critical?: boolean, onError?: (errorObj: any) => void) => (err: Error) => {
    if (onError) {
      onError({
        errorKey,
        error: err,
        critical: critical || false,
      });
    }
  };
