import { EthProviders } from '@akashaorg/typings/sdk';
import { TFunction } from 'i18next';

const getDotColor = (status: number, errorMessage: string) => {
  if (errorMessage) return 'errorText';
  if (status > 5) return 'green';
  if (status >= 0) return 'accent';
};

const getStatusLabel = (status: number, t: TFunction, errorMessage?: string) => {
  if (status > 5) return t('Authorized');
  if (status > 1 && !errorMessage) return t('Authorizing');
  if (status == 1 && !errorMessage) return t('Connected');
  if (status == 0 && !errorMessage) return t('Connecting');

  if (errorMessage.includes("you'll need to set the")) return t('Network Error');
  if (errorMessage) return t('Failed to Authorize');
};

const getStatusDescription = (
  status: number,
  errorMessage: string,
  provider: EthProviders,
  isSignedUp: boolean,
  t: TFunction,
) => {
  if (errorMessage) {
    return errorMessage;
  }

  if (status > 5) {
    return isSignedUp
      ? t(
          'You have successfully connected and authorized your address. You will be redirected shortly',
        )
      : t(
          'You have successfully connected and authorized your address. Please register your public key in the next prompt and you will be redirected shortly',
        );
  }

  if (status >= 0) {
    if (provider === EthProviders.WalletConnect) return 'Please sign the requests to gain access';

    if (provider === EthProviders.Web3Injected)
      return isSignedUp
        ? t('You will be prompted with 2 signatures')
        : t('You will be prompted with 3 signatures');
  }
};

export { getDotColor, getStatusLabel, getStatusDescription };
