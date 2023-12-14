import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { mapBeamEntryData, useAnalytics, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { BeamCard, BeamFeed } from '@akashaorg/ui-lib-feed';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import { useParams } from 'react-router-dom';

export type ProfileBeamsPageProps = {
  isLoggedIn: boolean;
};

const ProfileBeamsPage: React.FC<ProfileBeamsPageProps> = props => {
  const { isLoggedIn } = props;

  const { getRoutingPlugin } = useRootComponentProps();

  const [analyticsActions] = useAnalytics();
  const navigateTo = React.useRef(getRoutingPlugin().navigateTo);

  const { profileId } = useParams<{
    profileId: string;
  }>();

  if (!isLoggedIn) {
    return navigateTo.current({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

  return (
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
  );
};

export default ProfileBeamsPage;
