import { useState, useEffect } from 'react';
import getSDK from '@akashaorg/awf-sdk';

async function resolveDid(did: string) {
  const sdk = getSDK();
  return sdk.services.common.misc.resolveDID(did);
}

export function useValidDid(profileId: string, enabled?: boolean) {
  const [validDid, setValidDid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (enabled) {
      setIsLoading(true);
      resolveDid(profileId).then(res => {
        if (res && 'isEthAddress' in res) {
          res.isEthAddress ? setValidDid(true) : setValidDid(false);
        } else {
          setValidDid(Boolean(res));
        }
        setIsLoading(false);
      });
    }
  }, [enabled, profileId]);

  return { validDid, isLoading };
}
