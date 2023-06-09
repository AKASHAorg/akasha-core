import getSDK from '@akashaorg/awf-sdk';
import { useQuery } from '@tanstack/react-query';
import { logError } from './utils/error-handler';

const ENS_KEY = 'ens';

const getEnsTexts = async (name: string) => {
  const sdk = getSDK();
  const res = await sdk.api.ens.getTexts(name);
  return res;
};

/**
 *
 */
export function useEnsTexts(name?: string, enabler = true) {
  return useQuery([ENS_KEY, name], async () => getEnsTexts(name), {
    enabled: !!name && enabler,
    keepPreviousData: true,
    onError: (err: Error) => logError('useEnsTexts.getTexts', err),
  });
}
