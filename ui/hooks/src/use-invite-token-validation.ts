import { useQuery } from '@tanstack/react-query';

import getSDK from '@akashaorg/awf-sdk';

import constants from './constants';
import { logError } from './utils/error-handler';

const { TOKEN_VALIDATION_KEY } = constants;

export interface IUseIsValidTokenProps {
  inviteToken: string;
  enabler: boolean;
}

const checkIsValidToken = async (inviteToken: string) => {
  const sdk = getSDK();
  return sdk.api.auth.validateInvite(inviteToken);
};

/**
 * Hook to validate invitation token
 * @example useIsValidToken hook
 * ```typescript
 * const inviteTokenQuery = useIsValidToken({ inviteToken: '5b71c9dd7bdea84c9ff2564a', enabler: true });
 *
 * const isValidToken = inviteTokenQuery.isSuccess;
 * ```
 */
export function useIsValidToken(props: IUseIsValidTokenProps) {
  return useQuery([TOKEN_VALIDATION_KEY], () => checkIsValidToken(props.inviteToken), {
    onError: (err: Error) => logError('[use-injected-provider.ts]: useInjectedProvider err', err),
    enabled: props.enabler,
    // retries 3 times by default, creating a sort of delay
    retry: false,
  });
}
