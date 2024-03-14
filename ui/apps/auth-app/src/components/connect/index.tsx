import React, { useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  hasOwn,
  useGetLogin,
  useLogin,
  useLogout,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';

import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { EthProviders } from '@akashaorg/typings/lib/sdk';
import { CONNECT } from '../../routes';
import ChooseProvider from './choose-provider';
import ConnectWallet from './connect-wallet';
import Card from '@akashaorg/design-system-core/lib/components/Card';

const Connect: React.FC<unknown> = () => {
  const { data } = useGetLogin();
  const isLoggedIn = !!data?.id;
  const authenticatedDID = data?.id;

  const { signIn, signInErrors } = useLogin();
  const { logOut } = useLogout();

  const { data: profileDataReq, loading } = useGetProfileByDidQuery({
    variables: { id: authenticatedDID },
    skip: !isLoggedIn,
  });

  const profileData =
    profileDataReq?.node && hasOwn(profileDataReq?.node, 'akashaProfile')
      ? profileDataReq?.node?.akashaProfile
      : null;

  const { worldConfig, getRoutingPlugin } = useRootComponentProps();

  const routingPlugin = useRef(getRoutingPlugin());

  useEffect(() => {
    const searchParam = new URLSearchParams(location.search);

    // if user is logged in, do not show the connect page
    if (isLoggedIn && !loading) {
      if (!profileData) {
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
  }, [isLoggedIn, loading, authenticatedDID, profileData, profileDataReq, worldConfig.homepageApp]);

  const handleDisconnect = () => {
    logOut();
    routingPlugin.current?.navigateTo({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: appRoutes => `${appRoutes[CONNECT]}`,
    });
  };

  const handleSignIn = provider => {
    signIn({ selectedProvider: provider });
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
              signInError={signInErrors}
            />
          }
        />
      </Routes>
    </Card>
  );
};

export default Connect;
