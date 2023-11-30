import React, { useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLoggedIn, useLogin, useLogout, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated';
import { EthProviders } from '@akashaorg/typings/lib/sdk';
import ChooseProvider from './choose-provider';
import ConnectWallet from './connect-wallet';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { CONNECT } from '../../routes';

const Connect: React.FC<unknown> = () => {
  const { isLoggedIn, authenticatedDID } = useLoggedIn();
  const logoutQuery = useLogout();

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

  const { worldConfig, getRoutingPlugin } = useRootComponentProps();

  const loginMutation = useLogin();

  const routingPlugin = useRef(getRoutingPlugin());

  useEffect(() => {
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
        <Route path="*" element={<ChooseProvider />} />

        <Route
          path={'/web3modal'}
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
