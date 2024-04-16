import React, { useRef, useEffect } from 'react';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useGetLogin, useRootComponentProps, hasOwn } from '@akashaorg/ui-awf-hooks';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { Outlet } from '@tanstack/react-router';

const MasterPage: React.FC = () => {
  const { worldConfig, getRoutingPlugin } = useRootComponentProps();

  const { data } = useGetLogin();
  const isLoggedIn = !!data?.id;
  const authenticatedDID = data?.id;

  const { data: profileDataReq, loading } = useGetProfileByDidQuery({
    variables: { id: authenticatedDID },
    skip: !isLoggedIn,
  });

  const profileData =
    profileDataReq?.node && hasOwn(profileDataReq?.node, 'akashaProfile')
      ? profileDataReq?.node?.akashaProfile
      : null;

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
  return (
    <Card padding="px-4 py-6">
      <Outlet />
    </Card>
  );
};

export default MasterPage;
