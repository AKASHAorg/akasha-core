import { EthProviders } from '@akashaorg/typings/sdk';
import { ErrorTypes } from '@akashaorg/ui-awf-hooks/lib/use-login';

const getDotColor = (status: number, error: ErrorTypes) => {
  if (status > 5) return 'green';
  if (status >= 0) return 'accent';
  if (error) return 'errorText';
};

const getStatusLabel = (status: number, error: ErrorTypes, errorMessage?: string) => {
  if (status > 5) return 'Authorized';
  if (status >= 0 && !errorMessage) return 'Authorizing';
  if (error) return 'Failed to Authorize';
};

const getStatusDescription = (status: number, errorMessage: string, provider: EthProviders) => {
  if (errorMessage) {
    return errorMessage;
  }

  if (status > 5) {
    return 'You have successfuly connected and authorized your address. You will be redirected shortly';
  }

  if (status > 1) {
    if (provider === EthProviders.Web3Injected) return 'You will be prompted with 2 signatures';
    if (provider === EthProviders.WalletConnect) return 'Please sign the requests to gain access';
  }
  if (status === 1) {
    if (provider === EthProviders.Web3Injected) return 'You will be prompted with 3 signatures';
    if (provider === EthProviders.WalletConnect) return 'Please sign the requests to gain access';
  }
  return '';
};

export { getDotColor, getStatusLabel, getStatusDescription };
