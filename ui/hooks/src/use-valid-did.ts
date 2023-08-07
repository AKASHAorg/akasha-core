import { useState, useEffect } from 'react';
import getSDK from '@akashaorg/awf-sdk';

async function resolveDid(did: string) {
  const sdk = getSDK();
  return sdk.services.common.misc.resolveDID(did);
}

export function useValidDid(profileId: string, enabled?: boolean) {
  const [validDid, setValidDid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEthAddress, setIsEthAddress] = useState<boolean | null>(null);

  useEffect(() => {
    if (enabled) {
      setIsLoading(true);
      resolveDid(profileId).then(res => {
        if (res && Object.hasOwn(res, 'isEthAddress')) {
          setIsEthAddress(res['isEthAddress']);
        }
        setValidDid(Boolean(res));

        setIsLoading(false);
      });
    }
  }, [enabled, profileId]);

  return { validDid, isLoading, isEthAddress };
}
