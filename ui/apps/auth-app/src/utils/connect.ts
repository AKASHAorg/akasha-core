import { EthProviders } from '@akashaorg/typings/sdk';

const getDotColor = (status: number) => {
  if (status > 5) return 'green';
  if (status > 1) return 'accent';
  if (status === 0) return 'errorText';
};

const getStatusLabel = (status: number, errorText?: string) => {
  if (status > 5) return 'Authorized';
  if (status > 1) return 'Authorizing';
  if (status === 0) return errorText;
};

const getStatusDescription = (status: number, provider: EthProviders) => {
  if (status > 5) {
    return 'You have successfuly connected and authorized your address. You will be redirected shortly';
  }

  if (status > 1) {
    if (provider === EthProviders.Web3Injected) return 'You will be prompted with 2 signatures';
    if (provider === EthProviders.WalletConnect) return 'Please sign the requests to gain access';
  }
  return '';
};

export { getDotColor, getStatusLabel, getStatusDescription };
