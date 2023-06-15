import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import { EthProviders } from '@akashaorg/typings/sdk';
import { AnalyticsCategories, RootComponentProps } from '@akashaorg/typings/ui';
import {
  useAnalytics,
  useGetLogin,
  useInjectedProvider,
  useLogin,
  useLogout,
} from '@akashaorg/ui-awf-hooks';
import ConnectWallet from './connect-wallet';
import ChooseProvider from './choose-provider';
import { getInjectedProviderDetails } from '../../utils/getInjectedProvider';
import routes, { CONNECT } from '../../routes';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';

const Connect: React.FC<RootComponentProps> = props => {
  const [analyticsActions] = useAnalytics();
  const loginQuery = useGetLogin();
  const logoutQuery = useLogout();
  const injectedProviderQuery = useInjectedProvider();
  const { t } = useTranslation('app-auth-ewa');
  const loginMutation = useLogin();
  const searchParam = new URLSearchParams(location.search);

  const routingPlugin = React.useRef(props.plugins['@akashaorg/app-routing']?.routing);

  const injectedProvider = React.useMemo(() => {
    return getInjectedProviderDetails(injectedProviderQuery.data, t);
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
  }, [loginQuery, props.worldConfig.homepageApp]);

  const handleProviderSelect = (provider: EthProviders) => {
    //this is required because of the backend
    localStorage.setItem('@acceptedTermsAndPrivacy', JSON.stringify(true));
    if (!routes[provider]) {
      console.warn('Route not found for provider', provider);
    }
    routingPlugin.current?.navigateTo({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: appRoutes => `${appRoutes[CONNECT]}${appRoutes[provider]}`,
    });
  };

  const handleDisconnect = (_provider: EthProviders) => {
    logoutQuery.mutate();
    routingPlugin.current?.navigateTo({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: appRoutes => `${appRoutes[CONNECT]}`,
    });
  };

  const handleSignIn = provider => {
    loginMutation.mutate({ selectedProvider: provider, checkRegistered: true });
  };

  return (
    <BasicCardBox>
      <Routes>
        <Route
          path="*"
          element={
            <ChooseProvider
              injectedProvider={injectedProvider}
              onProviderSelect={handleProviderSelect}
              plugins={props.plugins}
            />
          }
        />
        <Route
          path={routes[EthProviders.Web3Injected]}
          element={
            <ConnectWallet
              selectedProvider={EthProviders.Web3Injected}
              onSignIn={handleSignIn}
              onDisconnect={handleDisconnect}
              worldName={props.worldConfig.title}
              signInError={loginMutation.error}
            />
          }
        />
        <Route
          path={'/wallet-connect'}
          element={
            <ConnectWallet
              selectedProvider={EthProviders.WalletConnect}
              onSignIn={handleSignIn}
              onDisconnect={handleDisconnect}
              worldName={props.worldConfig.title}
              signInError={loginMutation.error}
            />
          }
        />
      </Routes>
    </BasicCardBox>
  );
};

export default Connect;
