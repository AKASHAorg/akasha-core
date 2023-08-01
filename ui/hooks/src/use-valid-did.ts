import { useState, useEffect } from 'react';
import { DIDDocument } from 'did-resolver';
import getSDK from '@akashaorg/awf-sdk';
import { ethers } from 'ethers';

async function resolveDid(did: string): Promise<DIDDocument> {
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
        // case when it's an eth address and we need to verify if it's a valid address separately
        if (res && profileId.includes('eip155')) {
          ethers.utils.isAddress(profileId.split(':').pop())
            ? setValidDid(true)
            : setValidDid(false);
        } else {
          setValidDid(Boolean(res));
        }
        setIsLoading(false);
      });
    }
  }, [enabled, profileId]);

  return { validDid, isLoading };
}
