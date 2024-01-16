import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import ProfileHeader from '../../profile-header';
import {
  mapBeamEntryData,
  useAnalytics,
  useGetLogin,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useParams } from '@tanstack/react-router';
import { BeamCard, BeamFeed } from '@akashaorg/ui-lib-feed';

const ProfileBeamsPage: React.FC<unknown> = () => {
  const { data: loginData, loading: authenticating } = useGetLogin();
  const { getRoutingPlugin } = useRootComponentProps();
  const [analyticsActions] = useAnalytics();
  const isLoggedIn = !!loginData?.id;
  const navigateTo = React.useRef(getRoutingPlugin().navigateTo);

  const { profileId } = useParams({ strict: false });

  if (!isLoggedIn && !authenticating) {
    return navigateTo.current({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

  return (
    <>
      <ProfileHeader />
      <Stack direction="column" spacing="gap-y-4" fullWidth>
        <BeamFeed
          did={profileId}
          queryKey={`app-profile_${profileId}_beams`}
          estimatedHeight={150}
          itemSpacing={8}
          scrollerOptions={{ overscan: 10 }}
          scrollTopIndicator={(listRect, onScrollToTop) => (
            <ScrollTopWrapper placement={listRect.left}>
              <ScrollTopButton hide={false} onClick={onScrollToTop} />
            </ScrollTopWrapper>
          )}
          renderItem={itemData => (
            <BeamCard
              entryData={mapBeamEntryData(itemData.node)}
              contentClickable={true}
              onContentClick={() =>
                navigateTo.current({
                  appName: '@akashaorg/app-akasha-integration',
                  getNavigationUrl: navRoutes => `${navRoutes.Beam}/${itemData.node.id}`,
                })
              }
              onReflect={() =>
                navigateTo.current({
                  appName: '@akashaorg/app-akasha-integration',
                  getNavigationUrl: navRoutes =>
                    `${navRoutes.Beam}/${itemData.node.id}${navRoutes.Reflect}`,
                })
              }
            />
          )}
          trackEvent={analyticsActions.trackEvent}
        />
      </Stack>
    </>
  );
};

export default ProfileBeamsPage;
