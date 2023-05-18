import { useQuery } from '@tanstack/react-query';
import getSDK from '@akashaorg/awf-sdk';
import { logError } from './utils/error-handler';

const MAINTENANCE_KEY = 'platform-maintenance';

const checkHealth = async () => {
  const sdk = getSDK();
  const res = await sdk.services.common.misc.getApiStatus();
  return res;
};

export const usePlaformHealthCheck = () => {
  return useQuery([MAINTENANCE_KEY], checkHealth, {
    onError: (err: Error) => logError('useIntegrationRegistry.getIntegrationInfo', err),
  });
};
