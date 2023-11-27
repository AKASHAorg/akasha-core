import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import { EthProviders, INJECTED_PROVIDERS } from '@akashaorg/typings/lib/sdk';

import {
  useInjectedProvider,
  useLoggedIn,
  useLogin,
  useLogout,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated';
import ConnectWallet from './connect-wallet';
import ChooseProvider from './choose-provider';
import routes, { CONNECT } from '../../routes';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { Metamask, Akasha } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';

const Connect: React.FC<unknown> = () => {
  const { isLoggedIn, authenticatedDID } = useLoggedIn();
  const logoutQuery = useLogout();
  const injectedProviderQuery = useInjectedProvider();

  const profileDataReq = useGetProfileByDidQuery(
    { id: authenticatedDID },
    {
      select: resp => {
        return resp.node;
      },
      enabled: isLoggedIn,
    },
  );

  const profile =
    profileDataReq.data && 'akashaProfile' in profileDataReq.data
      ? profileDataReq.data?.akashaProfile
      : null;

  const { t } = useTranslation('app-auth-ewa');
  const { worldConfig, getRoutingPlugin } = useRootComponentProps();

  const loginMutation = useLogin();

  const routingPlugin = React.useRef(getRoutingPlugin());

  const getInjectedProviderDetails = (provider: INJECTED_PROVIDERS) => {
    switch (provider) {
      // metamask
      case INJECTED_PROVIDERS.METAMASK:
        return {
          name: provider,
          icon: <Metamask />,
          titleLabel: provider,
          subtitleLabel: t('Connect using your MetaMask wallet'),
        };
      // provider not detected
      case INJECTED_PROVIDERS.NOT_DETECTED:
        return {
          name: provider,
          titleLabel: '',
          subtitleLabel: '',
        };
      default:
        return {
          name: provider,
          icon: <Akasha />,
          titleLabel: provider,
          subtitleLabel: t(
            'This wallet has not been tested extensively and may have issues. Please ensure it supports {{requiredNetworkName}} Network',
          ),
        };
    }
  };

  const injectedProvider = React.useMemo(() => {
    return getInjectedProviderDetails(injectedProviderQuery.data);
  }, [injectedProviderQuery.data]);

  React.useEffect(() => {
    const searchParam = new URLSearchParams(location.search);

    // if user is logged in, do not show the connect page
    if (isLoggedIn && profileDataReq.status !== 'loading') {
      if (!profile) {
        routingPlugin.current?.navigateTo({
          appName: '@akashaorg/app-profile',
          getNavigationUrl: () => `/${authenticatedDID}/edit`,
        });
        return;
      }

      routingPlugin.current?.handleRedirect({
        search: searchParam,
        fallback: {
          appName: worldConfig.homepageApp,
        },
      });
    }
  }, [isLoggedIn, authenticatedDID, profile, profileDataReq, worldConfig.homepageApp]);

  const handleProviderSelect = (provider: EthProviders) => {
    //this is required because of the backend
    localStorage.setItem('@acceptedTermsAndPrivacy', JSON.stringify(true));
    if (!routes[provider]) {
      console.warn('Route not found for provider', provider);
    }
    routingPlugin.current?.navigateTo({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: appRoutes =>
        `${appRoutes[CONNECT]}${appRoutes[provider]}${location.search ? `${location.search}` : ''}`,
    });
  };

  const handleDisconnect = () => {
    logoutQuery.mutate();
    routingPlugin.current?.navigateTo({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: appRoutes => `${appRoutes[CONNECT]}`,
    });
  };

  const handleSignIn = provider => {
    loginMutation.mutate({ selectedProvider: provider });
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
              worldName={worldConfig.title}
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
              worldName={worldConfig.title}
              signInError={loginMutation.error}
            />
          }
        />
      </Routes>
    </Card>
  );
};

export default Connect;
