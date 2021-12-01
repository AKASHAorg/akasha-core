import { lastValueFrom } from 'rxjs';
import { useQuery } from 'react-query';

import getSDK from '@akashaproject/awf-sdk';

import constants from './constants';
import { logError } from './utils/error-handler';

const { TOKEN_VALIDATION_KEY } = constants;

export interface IUseIsValidTokenProps {
  inviteToken: string;
  enabler: boolean;
}

const checkIsValidToken = async (inviteToken: string) => {
  const sdk = getSDK();
  await lastValueFrom(sdk.api.auth.validateInvite(inviteToken));
};

/* A hook to validate invitation token */
export function useIsValidToken(props: IUseIsValidTokenProps) {
  return useQuery([TOKEN_VALIDATION_KEY], () => checkIsValidToken(props.inviteToken), {
    onError: (err: Error) => logError('[use-injected-provider.ts]: useInjectedProvider err', err),
    enabled: props.enabler,
    // retries 3 times by default, creating a sort of delay
    retry: false,
  });
}
