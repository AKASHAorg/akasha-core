import { useState, useEffect } from 'react';
import getSDK from '@akashaorg/core-sdk';

async function resolveDid(did: string) {
  const sdk = getSDK();
  return sdk.services.common.misc.resolveDID(did);
}

/**
 * Hook to check the validity of an address
 * @example useValidDid hook
 * ```typescript
 * const { validDid, isEthAddress } = useValidDid(profileDID, !!profileDID)
 *
 * ```
 * If you want to conditionally eable or disable address check from the hook,
 *  include the `enabled`param, which is `!!profileDID` in the example above.
 **/
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
