import { useQuery } from '@tanstack/react-query';
import getSDK from '@akashaorg/awf-sdk';
import { LEGAL_DOCS } from '@akashaorg/typings/lib/ui';
import { logError } from './utils/error-handler';

export const LEGAL_KEY = 'Legal';

const getLegalDoc = async (docName: LEGAL_DOCS) => {
  const sdk = getSDK();
  return sdk.services.common.ipfs.getLegalDoc(docName);
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
