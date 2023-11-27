import React, { useEffect, useMemo, useRef, useState } from 'react';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  Akasha,
  Walletconnect,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ConnectErrorCard from '@akashaorg/design-system-components/lib/components/ConnectErrorCard';
import IndicatorDots from './indicator-dots';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import { EthProviders, PROVIDER_ERROR_CODES } from '@akashaorg/typings/lib/sdk';
import { useTranslation } from 'react-i18next';
import {
  switchToRequiredNetwork,
  useConnectWallet,
  useLoggedIn,
  useNetworkChangeListener,
  useRequiredNetwork,
} from '@akashaorg/ui-awf-hooks';

export type ConnectWalletProps = {
  selectedProvider: EthProviders;
  onSignIn: (provider: EthProviders) => void;
  onDisconnect: (provider: EthProviders) => void;
  worldName: string;
  signInError?: Error;
};

const ConnectWallet: React.FC<ConnectWalletProps> = props => {
  const { selectedProvider, onSignIn, onDisconnect, worldName, signInError } = props;
  const [errors, setErrors] = useState<{ title: string; subtitle: string }[]>([]);
  const [isSignInRetry, setIsSignInRetry] = useState(false);

  const connectWalletCall = useConnectWallet(selectedProvider);
  const signInCall = useRef(onSignIn);
  const signOutCall = useRef(onDisconnect);

  const { t } = useTranslation('app-auth-ewa');
  const requiredNetworkQuery = useRequiredNetwork();

  const [changedNetwork, changedNetworkUnsubscribe] = useNetworkChangeListener();

  const { isLoggedIn } = useLoggedIn();

  useEffect(() => {
    if (
      requiredNetworkQuery.isSuccess &&
      +changedNetwork?.chainId === requiredNetworkQuery.data.chainId &&
      !connectWalletCall.isSuccess &&
      !connectWalletCall.isLoading
    ) {
      setErrors([]);
      connectWalletCall.mutate();
    } else if (changedNetwork) {
      const errorTitle = t('Network not supported');
      const errorSubtitle = t(
        'The network you just changed to is not supported. Please change it to {{requiredNetworkName}}.',
        {
          requiredNetworkName,
        },
      );
      if (errors.find(e => e.title === errorTitle)) {
        return;
      }
      setErrors(prev => [...prev, { title: errorTitle, subtitle: errorSubtitle }]);
    }
    return () => {
      changedNetworkUnsubscribe();
    };
  }, [changedNetwork, requiredNetworkQuery.data]);

  const requiredNetworkName = useMemo(() => {
    if (requiredNetworkQuery.isSuccess) {
      return `${requiredNetworkQuery.data.name
        .charAt(0)
        .toLocaleUpperCase()}${requiredNetworkQuery.data.name.substring(1).toLocaleLowerCase()}`;
    } else {
      return null;
    }
  }, [requiredNetworkQuery]);

  const networkNotSupportedError = useMemo(() => {
    if (connectWalletCall.isError && selectedProvider === EthProviders.Web3Injected) {
      if (
        (connectWalletCall.error as Error & { code?: number })?.code ===
        PROVIDER_ERROR_CODES.UserRejected
      ) {
        return t('You have rejected the change network request. Please change it manually.');
      }
      return t(
        "To use AKASHA World during the alpha period, you'll need to set the {{selectedProviderName}} wallet to {{requiredNetworkName}}",
        {
          selectedProviderName: 'injected provider',
          requiredNetworkName,
        },
      );
    }
    return null;
  }, [
    connectWalletCall.error,
    connectWalletCall.isError,
    requiredNetworkName,
    selectedProvider,
    t,
  ]);

  useEffect(() => {
    connectWalletCall.mutate();
  }, []);

  useEffect(() => {
    if (connectWalletCall.isSuccess && connectWalletCall.data.length == 42 && !isSignInRetry) {
      signInCall.current(selectedProvider);
    }
  }, [connectWalletCall.isSuccess, isSignInRetry]);

  const handleChangeNetwork = () => {
    // change network to requiredNetwork
    // avoid spamming the user with errors
    switchToRequiredNetwork().catch(err => {
      let errorTitle = t("Switch Your Wallet's Network");
      let errorSubtitle = t(
        'The selected provider does not support changing networks, please manually change it to {{requiredNetworkName}}',
        { requiredNetworkName },
      );
      if (err.code === PROVIDER_ERROR_CODES.UserRejected) {
        errorTitle = t('Request Rejected!');
        errorSubtitle = t(
          'You have rejected the change network request. Please change it manually or try again.',
        );
      }
      if (errors.find(err => err.title === errorTitle)) {
        return;
      }
      setErrors(prevState => {
        if (prevState.find(err => err.title === errorTitle)) {
          return [...prevState, { title: errorTitle, subtitle: errorSubtitle }];
        }
        return prevState;
      });
    });
  };

  const handleSignInRetry = () => {
    setErrors([]);
    setIsSignInRetry(true);
    signInCall.current(selectedProvider);
  };

  const handleDisconnect = () => {
    // disconnect wallet
    signOutCall.current(selectedProvider);
  };

  return (
    <Stack spacing="gap-y-4">
      <Stack>
        <Text variant="body1" align="center" weight="bold">
          {t('Connecting to {{worldName}}', { worldName })}
        </Text>
        <Text variant="body1" align="center" weight="bold">
          {t('using your wallet')}
        </Text>
      </Stack>
      <Stack direction="row" align="center" justify="center">
        <AppIcon
          placeholderIcon={<Walletconnect />}
          background={{ gradient: 'gradient-to-b', from: 'orange-50', to: 'orange-200' }}
          radius={24}
          size={{ width: 120, height: 120 }}
          backgroundSize={120}
          iconColor="self-color"
        />
        <IndicatorDots
          isSuccess={isLoggedIn}
          hasErrors={
            Boolean(networkNotSupportedError) || Boolean(errors.length) || Boolean(signInError)
          }
        />
        <AppIcon
          placeholderIcon={<Akasha />}
          solid={true}
          background={{ gradient: 'gradient-to-b', from: 'blue-200', to: 'red-200' }}
          radius={24}
          size={{ width: 54, height: 54 }}
          backgroundSize={120}
          iconColor="black"
        />
      </Stack>
      {networkNotSupportedError && (
        <ConnectErrorCard
          title={t("Switch Your Wallet's Network")}
          message={networkNotSupportedError}
          action={{ onClick: handleChangeNetwork, label: t('Change Network') }}
        />
      )}
      {signInError && (
        <ConnectErrorCard
          title={t('Request Rejected!')}
          message={signInError.message}
          action={{ onClick: handleSignInRetry, label: t('Retry Network') }}
        />
      )}
      {errors.map((errObj, idx) => (
        <ConnectErrorCard key={idx} title={errObj.title} message={errObj.subtitle} />
      ))}

      <Stack spacing="gap-y-6">
        {!!connectWalletCall.data?.length && (
          <Stack spacing="gap-y-8">
            <Stack spacing="gap-y-2">
              <Text variant="h6" weight="bold" align="center">
                {isLoggedIn ? t('Authorized') : t('Authorizing')}
              </Text>
              <Text variant="body1" align="center" color={{ light: 'grey4', dark: 'grey7' }}>
                {isLoggedIn
                  ? t('You have successfully connected and authorized your address')
                  : t('You will be prompted with 1 signature')}
              </Text>
            </Stack>

            <Stack spacing="gap-y-2">
              <Text variant="button-sm" weight="bold" align="center">
                {t('Your Address')}
              </Text>
              <Text variant="subtitle2" align="center" color={{ light: 'grey4', dark: 'grey7' }}>
                {connectWalletCall.data}
              </Text>
            </Stack>
          </Stack>
        )}
        <Stack align="center" justify="center">
          <Button
            variant="text"
            size="lg"
            onClick={handleDisconnect}
            label={t('Disconnect or change the way to connect')}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ConnectWallet;
