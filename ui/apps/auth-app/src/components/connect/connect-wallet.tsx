import React from 'react';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ConnectErrorCard from '@akashaorg/design-system-components/lib/components/ConnectErrorCard';
import IndicatorDots from './indicator-dots';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { EthProviders, PROVIDER_ERROR_CODES } from '@akashaorg/typings/sdk';
import { useTranslation } from 'react-i18next';
import {
  switchToRequiredNetwork,
  useConnectWallet,
  useInjectedProvider,
  useNetworkChangeListener,
  useRequiredNetwork,
} from '@akashaorg/ui-awf-hooks';
import { getInjectedProviderDetails } from '../../utils/getInjectedProvider';

export interface IConnectWalletProps {
  selectedProvider: EthProviders;
  onSignIn: (provider: EthProviders) => void;
  onDisconnect: (provider: EthProviders) => void;
  worldName: string;
  signInError?: Error;
}

const ConnectWallet: React.FC<IConnectWalletProps> = props => {
  const { selectedProvider, onSignIn, onDisconnect, worldName, signInError } = props;
  const [errors, setErrors] = React.useState<{ title: string; subtitle: string }[]>([]);
  const [isSignInRetry, setIsSignInRetry] = React.useState(false);

  const connectWalletCall = useConnectWallet(selectedProvider);
  const signInCall = React.useRef(onSignIn);
  const signOutCall = React.useRef(onDisconnect);

  const { t } = useTranslation('app-auth-ewa');
  const requiredNetworkQuery = useRequiredNetwork();
  const injectedProviderQuery = useInjectedProvider();

  const [changedNetwork, changedNetworkUnsubscribe] = useNetworkChangeListener();

  React.useEffect(() => {
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

  const requiredNetworkName = React.useMemo(() => {
    if (requiredNetworkQuery.isSuccess) {
      return `${requiredNetworkQuery.data.name
        .charAt(0)
        .toLocaleUpperCase()}${requiredNetworkQuery.data.name.substring(1).toLocaleLowerCase()}`;
    } else {
      return null;
    }
  }, [requiredNetworkQuery]);

  const networkNotSupportedError = React.useMemo(() => {
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
          selectedProviderName: getInjectedProviderDetails(injectedProviderQuery.data, t).name,
          requiredNetworkName,
        },
      );
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectWalletCall, requiredNetworkName, selectedProvider]);

  React.useEffect(() => {
    connectWalletCall.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (connectWalletCall.isSuccess && connectWalletCall.data.length == 42 && !isSignInRetry) {
      signInCall.current(selectedProvider);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <Stack direction="column" spacing="gap-y-4">
      <Box>
        <Text variant="body1" align="center" weight="bold">
          {t('Connect to {{worldName}}', { worldName })}
        </Text>
        <Text variant="body1" align="center" weight="bold">
          {t('using your wallet')}
        </Text>
      </Box>
      <Stack align="center" justify="center">
        <AppIcon
          placeholderIconType={
            selectedProvider === EthProviders.Web3Injected ? 'metamask' : 'walletconnect'
          }
          background={{ gradient: 'gradient-to-b', from: 'orange-50', to: 'orange-200' }}
          radius={24}
          size={
            selectedProvider === EthProviders.Web3Injected
              ? { width: 88, height: 88 }
              : { width: 120, height: 120 }
          }
          backgroundSize={120}
          iconColor="self-color"
        />
        <IndicatorDots
          hasErrors={
            Boolean(networkNotSupportedError) || Boolean(errors.length) || Boolean(signInError)
          }
        />
        <AppIcon
          placeholderIconType="akasha"
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
      <Box>
        {!!connectWalletCall.data?.length && (
          <Box>
            <Text variant="subtitle2" weight="bold">
              {t('Your Address')}
            </Text>
            <Text variant="subtitle2">{connectWalletCall.data}</Text>
          </Box>
        )}
        <Stack align="center" justify="center">
          <Button
            variant="text"
            size="lg"
            onClick={handleDisconnect}
            label={t('Disconnect or change way to connect')}
          >
            {t('Disconnect or change way to connect')}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default ConnectWallet;
