import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import {
  hasOwn,
  mapBeamEntryData,
  useAnalytics,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { BeamCard, BeamFeed } from '@akashaorg/ui-lib-feed';

type ProfileBeamsPageProps = {
  profileDID: string;
};

const ProfileBeamsPage: React.FC<ProfileBeamsPageProps> = props => {
  const { profileDID } = props;
  const { getRoutingPlugin } = useRootComponentProps();
  const [analyticsActions] = useAnalytics();
  const navigateTo = React.useRef(getRoutingPlugin().navigateTo);

  return (
    <Stack direction="column" spacing="gap-y-4" fullWidth>
      <BeamFeed
        did={profileDID}
        queryKey={`app-profile_${profileDID}_beams`}
        estimatedHeight={150}
        itemSpacing={8}
        scrollerOptions={{ overscan: 10 }}
        scrollTopIndicator={(listRect, onScrollToTop) => (
          <ScrollTopWrapper placement={listRect.left}>
            <ScrollTopButton hide={false} onClick={onScrollToTop} />
          </ScrollTopWrapper>
        )}
        renderItem={itemData => {
          if (hasOwn(itemData.node, 'content'))
            return (
              <BeamCard
                entryData={mapBeamEntryData(itemData.node)}
                contentClickable={true}
                onContentClick={() =>
                  navigateTo.current({
                    appName: '@akashaorg/app-antenna',
                    getNavigationUrl: navRoutes => `${navRoutes.Beam}/${itemData.node.id}`,
                  })
                }
                onReflect={() =>
                  navigateTo.current({
                    appName: '@akashaorg/app-antenna',
                    getNavigationUrl: navRoutes =>
                      `${navRoutes.Beam}/${itemData.node.id}${navRoutes.Reflect}`,
                  })
                }
                showNSFWCard={itemData.node.nsfw}
                showHiddenContent={true}
              />
            );
        }}
        trackEvent={analyticsActions.trackEvent}
      />
    </Stack>
  );
};

export default ProfileBeamsPage;
