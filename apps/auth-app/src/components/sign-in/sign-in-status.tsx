import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { EthProviders } from '@akashaproject/ui-awf-typings';
import { PROVIDER_ERROR_CODES } from '@akashaproject/sdk-typings/lib/interfaces/common';

const { WalletRequestStep, Spinner } = DS;

interface SignInStatusProps {
  status: number;
  isActive: boolean;
  ethAddress: string;
  selectedProvider: EthProviders;
  onSignRequest: () => void;
  onSignIn: () => void;
  signInError: { message?: string; code?: number; extensions?: { code?: string } };
  requiredNetworkName: string;
  onSignInComplete: () => void;
}

const errorMapping = {
  [PROVIDER_ERROR_CODES.UserRejected]:
    'You have declined the signature request. You will not be able to proceed unless you accept all signature requests.',
  [PROVIDER_ERROR_CODES.WrongNetwork]:
    'Ethereum World only works with the {{networkName}} test network. Please set your network to {{networkName}} to continue.',
  [PROVIDER_ERROR_CODES.RequestTimeout]:
    'The signature request has timed out. Please try again to sign the request.',
};

const SignInStatus: React.FC<SignInStatusProps> = props => {
  const { t } = useTranslation();
  const {
    status,
    isActive,
    ethAddress,
    selectedProvider,
    onSignRequest,
    onSignIn,
    requiredNetworkName,
    onSignInComplete,
    signInError,
  } = props;
  const signInCall = React.useRef(onSignIn);
  const signInCompleteCall = React.useRef(onSignInComplete);

  const errorMessage = React.useMemo(() => {
    if (signInError && signInError.code && errorMapping[signInError.code]) {
      return t(errorMapping[signInError.code], { requiredNetworkName });
    }

    if (signInError) {
      return signInError.message
        ? signInError.message
        : t('An unknown error has occurred. Please refresh the page and try again.');
    }
    return null;
  }, [signInError, requiredNetworkName]);

  React.useEffect(() => {
    if (isActive) {
      return signInCall.current();
    }
  }, [isActive]);
  React.useEffect(() => {
    if (status >= 8) {
      signInCompleteCall.current();
    }
  }, [status]);

  if (!isActive) {
    return null;
  }

  return (
    <>
      <WalletRequestStep
        heading={t('Choose the Ethereum address to connect')}
        explanation=""
        problem={t(
          'Not seeing the wallet request? Please make sure to open your wallet extension. If you’re still not seeing it, we can resend it.',
        )}
        resend={t('Resend request')}
        complete={t('You’ve connected an Ethereum address')}
        buttonLabel={''}
        walletRequest={onSignRequest}
        ethAddress={ethAddress}
        textAgain={t('Try Again')}
        pending={status === 1}
        completed={status > 1 || selectedProvider === EthProviders.Torus}
        error={status === 1 && errorMessage}
      />
      <WalletRequestStep
        heading={t('Verify that you own this account')}
        explanation=""
        problem={t(
          'Not seeing the wallet request? Please make sure to open your wallet extension. If you’re still not seeing it, we can resend it.',
        )}
        resend={t('Resend request')}
        complete={t('You have verified that you own this account')}
        buttonLabel={''}
        walletRequest={onSignRequest}
        textAgain={t('Try Again')}
        pending={status === 3}
        completed={status > 3 || selectedProvider === EthProviders.Torus}
        error={status === 3 && errorMessage}
      />
      <WalletRequestStep
        heading={t('Allow us to access your profile')}
        explanation=""
        problem={t(
          'Not seeing the wallet request? Please make sure to open your wallet extension. If you’re still not seeing it, we can resend it.',
        )}
        resend={t('Resend request')}
        complete={t('You have allowed us to access your profile')}
        buttonLabel={''}
        walletRequest={onSignRequest}
        textAgain={t('Try Again')}
        pending={status === 5}
        completed={status > 5 || selectedProvider === EthProviders.Torus}
        error={status === 5 && errorMessage}
      />
      {status > 5 && <Spinner />}
    </>
  );
};

export default SignInStatus;
