import React, { useEffect, useRef } from 'react';
import ChooseProvider from './choose-provider';
import ConnectWallet from './connect-wallet';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { Routes, Route } from 'react-router-dom';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { EthProviders } from '@akashaorg/typings/lib/sdk';
import { CONNECT } from '../../routes';

const Connect: React.FC<unknown> = () => {
  const { worldConfig, getRoutingPlugin } = useRootComponentProps();
  const {
    data: { authenticatedDID, isLoadingInfo, authenticatedProfile, authenticationError },
    userStore,
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;
  const routingPlugin = useRef(getRoutingPlugin());

  useEffect(() => {
    const searchParam = new URLSearchParams(location.search);

    // if user is logged in, do not show the connect page
    if (isLoggedIn && !isLoadingInfo) {
      if (!authenticatedProfile) {
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
  }, [isLoggedIn, authenticatedDID, worldConfig.homepageApp, isLoadingInfo, authenticatedProfile]);

  const handleDisconnect = () => {
    userStore.logout();
    routingPlugin.current?.navigateTo({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: appRoutes => `${appRoutes[CONNECT]}`,
    });
  };

  const handleSignIn = provider => {
    userStore.login({ provider });
  };

  return (
    <Card padding="px-4 py-6">
      <Routes>
        <Route path="*" element={<ChooseProvider />} />
        <Route
          path={'/web3modal'}
          element={
            <ConnectWallet
              selectedProvider={EthProviders.WalletConnect}
              onSignIn={handleSignIn}
              onDisconnect={handleDisconnect}
              worldName={worldConfig.title}
              signInError={authenticationError}
            />
          }
        />
      </Routes>
    </Card>
  );
};

export default Connect;
