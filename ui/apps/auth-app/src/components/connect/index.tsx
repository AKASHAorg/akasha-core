import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import { EthProviders, INJECTED_PROVIDERS } from '@akashaorg/typings/sdk';
import { AnalyticsCategories, IconType, RootComponentProps } from '@akashaorg/typings/ui';
import {
  useAnalytics,
  useConnectWallet,
  useGetLogin,
  useInjectedProvider,
  useLogin,
  useRequiredNetworkName,
} from '@akashaorg/ui-awf-hooks';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import ConnectWallet from './connect-wallet';
import ChooseProvider from './choose-provider';

export enum ConnectStep {
  CHOOSE_PROVIDER = 'Choose_Provider',
  CONNECT_WALLET = 'Connect_Wallet',
  INVITE_CODE = 'Invite_Code',
}

const availableIcons = [
  'safe',
  'nifty',
  'dapper',
  'opera',
  'trust',
  'coinbase',
  'imtoken',
  'status',
  'web3',
];

const Connect: React.FC<RootComponentProps> = props => {
  const [selectedProvider, setSelectedProvider] = React.useState<EthProviders>(EthProviders.None);
  const [signInComplete, setSignInComplete] = React.useState(false);
  const [analyticsActions] = useAnalytics();
  const loginQuery = useGetLogin();
  const injectedProviderQuery = useInjectedProvider();
  const requiredNetworkQuery = useRequiredNetworkName();
  const { t } = useTranslation('app-auth-ewa');
  const connectWallet = useConnectWallet(selectedProvider);
  const loginMutation = useLogin();
  const searchParam = new URLSearchParams(location.search);

  const routingPlugin = React.useRef(props.plugins['@akashaorg/app-routing']?.routing);
  const requiredNetworkName = React.useMemo(() => {
    if (requiredNetworkQuery.isSuccess) {
      return `${requiredNetworkQuery.data.charAt(0).toLocaleUpperCase()}${requiredNetworkQuery.data
        .substring(1)
        .toLocaleLowerCase()}`;
    } else {
      return null;
    }
  }, [requiredNetworkQuery]);

  const injectedProvider = React.useMemo(() => {
    switch (injectedProviderQuery.data) {
      // metamask
      case INJECTED_PROVIDERS.METAMASK:
        return {
          name: injectedProviderQuery.data,
          iconType: 'metamask' as IconType,
          titleLabel: injectedProviderQuery.data,
          subtitleLabel: t('Connect using your MetaMask wallet'),
        };
      // provider not detected
      case INJECTED_PROVIDERS.NOT_DETECTED:
        return {
          name: injectedProviderQuery.data,
          titleLabel: '',
          subtitleLabel: '',
        };
      default:
        return {
          name: injectedProviderQuery.data,
          iconType: availableIcons.includes(injectedProviderQuery.data.toLocaleLowerCase())
            ? (injectedProviderQuery.data.toLocaleLowerCase() as IconType)
            : ('wallet' as IconType),
          titleLabel: injectedProviderQuery.data,
          subtitleLabel: t(
            'This wallet has not been tested extensively and may have issues. Please ensure it supports {{requiredNetworkName}} Network',
          ),
        };
    }
  }, [injectedProviderQuery.data]);

  React.useEffect(() => {
    // if user is logged in, do not show the connect page
    if (loginQuery.data?.id) {
      routingPlugin.current?.handleRedirect({
        search: searchParam,
        fallback: {
          appName: props.worldConfig.homepageApp,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginQuery, props.worldConfig.homepageApp]);

  React.useEffect(() => {
    if (
      connectWallet.isError &&
      connectWallet.error.message.includes('already pending for origin')
    ) {
      connectWallet.reset();
      connectWallet.mutateAsync();
    }
  }, [connectWallet]);

  const handleProviderSelect = (provider: EthProviders) => {
    setSelectedProvider(provider);
    //this is required because of the backend
    localStorage.setItem('@acceptedTermsAndPrivacy', JSON.stringify(true));
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
  };

  const handleSignIn = () => {
    loginMutation.mutate({ selectedProvider, checkRegistered: true });
  };

  return (
    <Card>
      <Routes>
        <Route
          path="*"
          element={
            <ChooseProvider
              injectedProvider={injectedProvider}
              onProviderSelect={handleProviderSelect}
              requiredNetworkName={requiredNetworkName}
            />
          }
        />
        <Route
          path={'/metamask'}
          element={
            <ConnectWallet
              selectedProvider={EthProviders.Web3Injected}
              status={1}
              connectedAddress={connectWallet.data}
              onSignIn={handleSignIn}
              onSignInComplete={handleSignInComplete}
              onDisconnect={handleDisconnect}
              onConnectWallet={connectWallet.mutate}
            />
          }
        />
        <Route
          path={'/wallet-connect'}
          element={
            <ConnectWallet
              status={1}
              selectedProvider={EthProviders.WalletConnect}
              connectedAddress={connectWallet.data}
              onSignIn={handleSignIn}
              onSignInComplete={handleSignInComplete}
              onDisconnect={handleDisconnect}
              onConnectWallet={connectWallet.mutate}
            />
          }
        />
      </Routes>
    </Card>
  );
};

export default Connect;
