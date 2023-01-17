import { EthProviders } from '@akashaorg/typings/sdk';

const getDotColor = (status: number, errorMessage: string) => {
  if (errorMessage) return 'errorText';
  if (status > 5) return 'green';
  if (status >= 0) return 'accent';
};

const getStatusLabel = (status: number, errorMessage?: string) => {
  if (status > 5) return 'Authorized';
  if (status > 1 && !errorMessage) return 'Authorizing';
  if (status == 1 && !errorMessage) return 'Connected';
  if (status == 0 && !errorMessage) return 'Connecting';

  if (errorMessage.includes("you'll need to set the")) return 'Network Error';
  if (errorMessage) return 'Failed to Authorize';
};

const getStatusDescription = (
  status: number,
  errorMessage: string,
  provider: EthProviders,
  isSignedUp: boolean,
) => {
  if (errorMessage) {
    return errorMessage;
  }

  if (status > 5) {
    return isSignedUp
      ? 'You have successfully connected and authorized your address. You will be redirected shortly'
      : 'You have successfully connected and authorized your address. Please register your public key in the next prompt and you will be redirected shortly';
  }

  if (status >= 0) {
    if (provider === EthProviders.WalletConnect) return 'Please sign the requests to gain access';

    if (provider === EthProviders.Web3Injected)
      return isSignedUp
        ? 'You will be prompted with 2 signatures'
        : 'You will be prompted with 3 signatures';
  }
};

export { getDotColor, getStatusLabel, getStatusDescription };
