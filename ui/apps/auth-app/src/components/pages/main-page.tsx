import React, { useRef, useEffect } from 'react';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { Outlet } from '@tanstack/react-router';

const MainPage: React.FC = () => {
  const { worldConfig, getRoutingPlugin } = useRootComponentProps();

  const {
    data: { authenticatedDID, isLoadingInfo, authenticatedProfile },
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
  return (
    <Card padding="px-4 py-6">
      <Outlet />
    </Card>
  );
};

export default MainPage;
