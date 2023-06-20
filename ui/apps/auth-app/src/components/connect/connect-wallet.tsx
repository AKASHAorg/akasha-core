import React from 'react';
import { EthProviders, PROVIDER_ERROR_CODES } from '@akashaorg/typings/sdk';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import BoxedIcon from './boxed-icon';
import IndicatorDots from './indicator-dots';
import { useTranslation } from 'react-i18next';
import {
  switchToRequiredNetwork,
  useConnectWallet,
  useInjectedProvider,
  useNetworkChangeListener,
  useRequiredNetwork,
} from '@akashaorg/ui-awf-hooks';
import Button from '@akashaorg/design-system-core/lib/components/Button';
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

  const changedNetwork = useNetworkChangeListener();

  React.useEffect(() => {
    if (
      requiredNetworkQuery.isSuccess &&
      +changedNetwork?.chainId === requiredNetworkQuery.data.chainId &&
      !connectWalletCall.isSuccess
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
        "To use Akasha World during the alpha period, you'll need to set the {{selectedProviderName}} wallet to {{requiredNetworkName}}",
        {
          selectedProviderName: getInjectedProviderDetails(injectedProviderQuery.data, t).name,
          requiredNetworkName,
        },
      );
    }
    return null;
  }, [connectWalletCall, requiredNetworkName, selectedProvider]);

  React.useEffect(() => {
    connectWalletCall.mutate();
  }, []);

  React.useEffect(() => {
    if (connectWalletCall.isSuccess && connectWalletCall.data.length == 42 && !isSignInRetry) {
      signInCall.current(selectedProvider);
    }
  }, [connectWalletCall.isSuccess, isSignInRetry]);

  const handleChangeNetwork = React.useCallback(() => {
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
      setErrors(prevState => [...prevState, { title: errorTitle, subtitle: errorSubtitle }]);
    });
  }, [errors]);

  const handleSignInRetry = () => {
    setIsSignInRetry(true);
    signInCall.current(selectedProvider);
  };

  const handleDisconnect = () => {
    // disconnect wallet
    signOutCall.current(selectedProvider);
  };

  const errorCardStyles =
    'flex flex-col border border(errorLight dark:errorDark) bg(errorLight/30 dark:errorDark/30) rounded-lg p-2 justify-center items-center';
  return (
    <Box customStyle={'p-4'}>
      <Box customStyle="justify-center flex flex-col">
        <Text variant="body1" align="center" weight="bold">
          {t('Connect to {{worldName}}', { worldName })}
        </Text>
        <Text variant="body1" align="center" weight="bold">
          {t('using your wallet')}
        </Text>
      </Box>
      <Box customStyle="flex flex-row justify-center items-center p-4">
        <BoxedIcon
          iconType={selectedProvider === EthProviders.Web3Injected ? 'metamask' : 'walletconnect'}
          background="bg(yellow-50 dark:yellow-50)"
          iconSize={{
            width: 'w-16',
            height: 'w-16',
          }}
          iconColor="self-color"
        />
        <IndicatorDots
          hasErrors={
            Boolean(networkNotSupportedError) || Boolean(errors.length) || Boolean(signInError)
          }
        />
        <BoxedIcon
          iconType="akasha"
          background="bg-gradient-to-b from-blue-200 to-red-200 dark:from-blue-200 dark:to-red-200"
          iconSize={{
            width: 'w-16',
            height: 'w-16',
          }}
          iconColor="black"
        />
      </Box>
      {networkNotSupportedError && (
        <Box customStyle={errorCardStyles}>
          <Text variant="body1" weight="bold" customStyle="my-2">
            {t("Switch Your Wallet's Network")}
          </Text>
          <Text variant="body1" align="center" customStyle="my-2">
            {networkNotSupportedError}.
          </Text>
          <Button
            variant="primary"
            customStyle="my-4"
            onClick={handleChangeNetwork}
            label={t('Change Network')}
            size="md"
          >
            {t('Change Network')}
          </Button>
        </Box>
      )}
      {signInError && (
        <Box customStyle={errorCardStyles}>
          <Text variant="body1" weight="bold" customStyle="my-2">
            {t('There was an error signing you in')}
          </Text>
          <Text variant="body1" align="center" customStyle="my-2">
            {signInError.message}.
          </Text>
          <Button
            variant="primary"
            customStyle="my-4"
            onClick={handleSignInRetry}
            label={t('Retry')}
            size="md"
          >
            {t('Retry')}
          </Button>
        </Box>
      )}
      {errors.map((errObj, idx) => (
        <Box key={idx} customStyle={`${errorCardStyles} mt-4`}>
          <Text variant="body1" weight="bold" customStyle="my-2">
            {errObj.title}
          </Text>
          <Text variant="body1" customStyle="my-2 text-center">
            {errObj.subtitle}
          </Text>
        </Box>
      ))}
      <Box>
        {!!connectWalletCall.data?.length && (
          <Box customStyle="items-center">
            <Text variant="subtitle2">{t('Your Address')}</Text>
            <Text variant="subtitle2">{connectWalletCall.data}</Text>
          </Box>
        )}
        <Box customStyle="flex flex-row justify-center items-center">
          <Button
            variant="text"
            size="lg"
            onClick={handleDisconnect}
            label={t('Disconnect or change way to connect')}
          >
            {t('Disconnect or change way to connect')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConnectWallet;
