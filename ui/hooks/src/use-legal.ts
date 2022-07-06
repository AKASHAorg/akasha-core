import { useQuery } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaorg/awf-sdk';
import { LEGAL_DOCS } from '@akashaorg/ui-awf-typings';
import { logError } from './utils/error-handler';

export const LEGAL_KEY = 'Legal';

const getLegalDoc = async (docName: LEGAL_DOCS) => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.services.common.ipfs.getLegalDoc(docName));
  return res.data;
};

/**
 * Hook to get legal docs stored on ipfs
 * @example useLegalDoc hook
 * ```typescript
 * const termsOfUseDocQuery = useLegalDoc('TermsOfUse');
 *
 * const termsOfUseDoc = termsOfUseDocQuery.data;
 * ```
 */
export function useLegalDoc(docName: LEGAL_DOCS) {
  return useQuery([LEGAL_KEY, docName], () => getLegalDoc(docName), {
    enabled: !!docName,
    keepPreviousData: true,
    onError: (err: Error) => logError('useLegal.getLegalDoc', err),
  });
}
