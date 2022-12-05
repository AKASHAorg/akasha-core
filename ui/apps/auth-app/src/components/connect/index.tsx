import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { EthProviders } from '@akashaorg/typings/sdk';
import { AnalyticsCategories, RootComponentProps } from '@akashaorg/typings/ui';
import {
  useAnalytics,
  useConnectProvider,
  useGetLogin,
  useGetProfile,
  useInjectedProvider,
  useNetworkState,
  useSignUp,
} from '@akashaorg/ui-awf-hooks';

import ConnectWallet from './connect-wallet';
import ChooseProvider from './choose-provider';

import { SIGN_UP_USERNAME } from '../../routes';
import { getStatusLabel } from '../../utils/connect';

const { MainAreaCardBox } = DS;

export enum ConnectStep {
  CHOOSE_PROVIDER = 'Choose_Provider',
  CONNECT_WALLET = 'Connect_Wallet',
}

export enum ConnectWalletStatus {
  CONNECTING = 'Connecting',
  CONNECTED = 'Connected',
  ERROR = 'Error',
}

const baseAppLegalRoute = '/@akashaorg/app-legal';

const Connect: React.FC<RootComponentProps> = props => {
  const [step, setStep] = React.useState<ConnectStep>(ConnectStep.CHOOSE_PROVIDER);
  const [selectedProvider, setSelectedProvider] = React.useState<EthProviders>(EthProviders.None);
  const [status] = React.useState<ConnectWalletStatus>(ConnectWalletStatus.CONNECTING);
  const [signInComplete, setSignInComplete] = React.useState(false);

  const [errorText] = React.useState<string>('Failed to Authorize');

  const [analyticsActions] = useAnalytics();
  const routingPlugin = React.useRef(props.plugins['@akashaorg/app-routing']?.routing);

  const loginQuery = useGetLogin();
  const profileDataReq = useGetProfile(loginQuery.data.pubKey, null, loginQuery.isSuccess);

  const { t } = useTranslation('app-auth-ewa');

  const connectProviderQuery = useConnectProvider(selectedProvider);

  const injectedProviderQuery = useInjectedProvider();
  const injectedProvider = React.useMemo(
    () => injectedProviderQuery.data,
    [injectedProviderQuery.data],
  );

  // const requiredNetworkQuery = useRequiredNetworkName();
  const networkStateQuery = useNetworkState(connectProviderQuery.data);

  const { ethAddress, fullSignUp } = useSignUp(selectedProvider, true);

  const networkNotSupported = React.useMemo(() => {
    if (
      selectedProvider !== EthProviders.None &&
      !networkStateQuery.isFetching &&
      connectProviderQuery.data
    ) {
      return networkStateQuery.data.networkNotSupported;
    }
    return false;
  }, [networkStateQuery, selectedProvider, connectProviderQuery.data]);

  // const isNotRegistered = React.useMemo(() => {
  //   if (error?.message && typeof error.message === 'string') {
  //     return error.message.toLowerCase().trim() === 'profile not found';
  //   }
  //   return false;
  // }, [error]);

  React.useEffect(() => {
    if (connectProviderQuery.isError) {
      setSelectedProvider(EthProviders.None);
    }
  }, [connectProviderQuery.isError]);

  React.useEffect(() => {
    if (signInComplete && profileDataReq.isSuccess && !!profileDataReq.data?.userName) {
      const searchParam = new URLSearchParams(location.search);
      routingPlugin.current?.handleRedirect({
        search: searchParam,
        fallback: {
          appName: props.worldConfig.homepageApp,
        },
      });
    }
    if (signInComplete && profileDataReq.isSuccess && !profileDataReq.data?.userName) {
      routingPlugin.current?.navigateTo({
        appName: '@akashaorg/app-auth-ewa',
        getNavigationUrl: routes => routes[SIGN_UP_USERNAME],
      });
    }
  }, [signInComplete, profileDataReq, props.baseRouteName, props.worldConfig.homepageApp]);

  // const requiredNetworkName = `${requiredNetworkQuery.data
  //   .charAt(0)
  //   .toLocaleUpperCase()}${requiredNetworkQuery.data.substr(1).toLocaleLowerCase()}`;

  // const handleSwitchNetworkMetamask = () => {
  //   switchToRequiredNetwork();
  // };

  // const handleNetworkRecheck = () => {
  //   networkStateQuery.refetch();
  // };

  const handleProviderSelect = (provider: EthProviders) => {
    setSelectedProvider(provider);
    if (connectProviderQuery.data) {
      setStep(ConnectStep.CONNECT_WALLET);
    }
    // fullSignUp.mutate();
  };

  const handleSignInComplete = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.SIGN_IN,
      action: 'Successful Sign In',
    });
    setSignInComplete(true);
  };

  const handleDisconnect = () => {
    setSelectedProvider(EthProviders.None);
    setStep(ConnectStep.CHOOSE_PROVIDER);
  };

  return (
    <MainAreaCardBox pad="large">
      {step === ConnectStep.CHOOSE_PROVIDER && (
        <ChooseProvider
          titleLabel={t('✨ Welcome to AKASHA World ✨')}
          subtitleLabel={t('Choose a way to connect')}
          infoLabel={t('Web3 Wallets')}
          accordionTitle={t('What is a wallet?')}
          accordionContent={t(
            "A web3 wallet is simply a digital wallet that can be used to store digital assets. These digital assets include Non-fungible tokens (NFTs). It's also a tool that allows people to interact with Dapps and pltaforms like AKASHA world with out storing any personal data.",
          )}
          accordionFooter={t('Get your own wallet')}
          accordionFooterCTA={t('Get a Metamask Wallet')}
          accordionFooterCTAUrl="https://metamask.io"
          wcSubtitleLabel={t('Scan with WalletConnect')}
          footerLabel={t('By connecting to AKASHA world, you agree to our ')}
          footerCTAArr={[
            {
              href: `${baseAppLegalRoute}/terms-of-service`,
              label: 'Terms & Conditions',
              delimiter: ', ',
            },
            {
              href: `${baseAppLegalRoute}/privacy-policy`,
              label: 'Privacy Policy',
              delimiter: ', and ',
            },
            {
              href: `${baseAppLegalRoute}/code-of-conduct`,
              label: 'Code of Conduct',
              delimiter: '.',
            },
          ]}
          // selectedProvider={selectedProvider}
          // providerIsConnected={connectProviderQuery.data}
          injectedProvider={{
            ...injectedProvider,
            details: {
              ...injectedProvider.details,
              subtitleLabel: t(injectedProvider.details.subtitleLabel),
            },
          }}
          onProviderSelect={handleProviderSelect}
        />
      )}
      {step === ConnectStep.CONNECT_WALLET && (
        <ConnectWallet
          isActive={
            selectedProvider !== EthProviders.None &&
            !networkNotSupported &&
            connectProviderQuery.data
          }
          titleLine1Label={t('{{connect}} to AKASHA World', {
            connect: status === ConnectWalletStatus.CONNECTED ? 'Connected' : 'Connecting',
          })}
          titleLine2Label={t('using your wallet')}
          selectedProvider={selectedProvider}
          status={status}
          statusLabel={t(getStatusLabel(status, errorText))}
          statusDescription={t('{{descprition}}', {
            descprition:
              selectedProvider === EthProviders.Web3Injected
                ? 'You will be prompted with 2 signatures'
                : 'Please sign the requests to gain access',
          })}
          yourAddressLabel={t('Your Address')}
          connectedAddress={ethAddress}
          connectedAddressPlaceholder={t(
            'the address you select to connect with will be shown here',
          )}
          footerLabel="Disconnect or change way to connect"
          onSignIn={fullSignUp.mutate}
          onSignInComplete={handleSignInComplete}
          onDisconnect={handleDisconnect}
        />
      )}
    </MainAreaCardBox>
  );
};

export default Connect;
