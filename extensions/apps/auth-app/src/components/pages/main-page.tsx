import React, { useRef, useEffect } from 'react';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Outlet } from '@tanstack/react-router';

const MainPage: React.FC = () => {
  const { worldConfig, getCorePlugins } = useRootComponentProps();

  const {
    data: { authenticatedDID, authenticatedProfile },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;

  const routingPlugin = useRef(getCorePlugins().routing);
  useEffect(() => {
    const searchParam = new URLSearchParams(location.search);

    // if user is logged in, do not show the connect page
    if (isLoggedIn) {
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
  }, [isLoggedIn, authenticatedDID, worldConfig.homepageApp, authenticatedProfile]);
  return (
    <Card className="px-4">
      <Outlet />
    </Card>
  );
};

export default MainPage;
