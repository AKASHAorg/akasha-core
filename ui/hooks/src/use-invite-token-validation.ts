import { lastValueFrom } from 'rxjs';
import { useQuery } from 'react-query';

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
  return lastValueFrom(sdk.api.auth.validateInvite(inviteToken));
};

/**
 * Hook to validate invitation token
 * @param props - payload containing the token and enabler value that determines when the query is allowed to run
 */
export function useIsValidToken(props: IUseIsValidTokenProps) {
  return useQuery([TOKEN_VALIDATION_KEY], () => checkIsValidToken(props.inviteToken), {
    onError: (err: Error) => logError('[use-injected-provider.ts]: useInjectedProvider err', err),
    enabled: props.enabler,
    // retries 3 times by default, creating a sort of delay
    retry: false,
  });
}
