import getSDK from '@akashaorg/awf-sdk';
import { LEGAL_DOCS } from '@akashaorg/typings/lib/ui';
import { logError } from './utils/error-handler';
import { useEffect, useState } from 'react';

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
  const [data, setData] = useState<string>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getLegalDoc(docName);
        if (res) {
          setData(res);
          setIsLoading(false);
        }
      } catch (err) {
        setData(null);

        setError(err);
        logError('useLegal.getLegalDoc', err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error, isFetched: data !== undefined };
}
