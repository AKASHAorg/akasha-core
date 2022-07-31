import getSDK from '@akashaorg/awf-sdk';
import { lastValueFrom } from 'rxjs';
import { useQuery } from 'react-query';
import { logError } from './utils/error-handler';

export const APP_DESCRIPTION_KEY = 'App_Description';

const getAppDescription = async (ipfsHash: string) => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.services.common.ipfs.catDocument<string>(ipfsHash));
  return res.data;
};

/**
 * Hook to get detailed description for app
 * @example useAppDescription hook
 * ```typescript
 * const detailedDescriptionQuery = useAppDescription('ipfslinktodescription');
 *
 * const description = detailedDescriptionQuery.data
 * ```
 */
export function useAppDescription(ipfsLink: string) {
  const ipfsHash = ipfsLink?.match(/\/\/(.*)/)?.[1];
  return useQuery([APP_DESCRIPTION_KEY, ipfsLink], () => getAppDescription(ipfsHash), {
    enabled: !!ipfsHash,
    keepPreviousData: true,
    onError: (err: Error) => logError('useAppSettings.getAppDescription', err),
  });
}
