import { useQuery } from 'react-query';
import getSDK from '@akashaorg/awf-sdk';
import { logError } from './utils/error-handler';

const MAINTENANCE_KEY = 'platform-maintenance';

const checkHealth = async () => {
  const sdk = getSDK();
  const res = await sdk.services.common.misc.getApiStatus();
  return { ...res, success: false };
};

export const usePlaformHealthCheck = () => {
  return useQuery([MAINTENANCE_KEY], checkHealth, {
    onError: (err: Error) => logError('useIntegrationRegistry.getIntegrationInfo', err),
  });
};
