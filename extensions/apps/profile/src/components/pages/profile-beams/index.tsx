import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import { hasOwn, mapBeamEntryData, useAnalytics } from '@akashaorg/ui-awf-hooks';
import { BeamCard, BeamFeedByAuthor } from '@akashaorg/ui-lib-feed';

type ProfileBeamsPageProps = {
  profileDID: string;
};

const ProfileBeamsPage: React.FC<ProfileBeamsPageProps> = props => {
  const { profileDID } = props;
  const [analyticsActions] = useAnalytics();

  return (
    <Stack direction="column" spacing="gap-y-4" fullWidth>
      <BeamFeedByAuthor
        did={profileDID}
        scrollRestorationStorageKey={`app-profile_${profileDID}_beams`}
        estimatedHeight={150}
        itemSpacing={8}
        scrollOptions={{ overScan: 10 }}
        scrollTopIndicator={(listRect, onScrollToTop) => (
          <ScrollTopWrapper placement={listRect.left}>
            <ScrollTopButton hide={false} onClick={onScrollToTop} />
          </ScrollTopWrapper>
        )}
        renderItem={itemData => {
          if (hasOwn(itemData, 'content'))
            return (
              <BeamCard
                entryData={mapBeamEntryData(itemData)}
                contentClickable={true}
                showNSFWCard={itemData?.nsfw}
                showHiddenContent={false}
              />
            );
        }}
        trackEvent={analyticsActions.trackEvent}
      />
    </Stack>
  );
};

export default ProfileBeamsPage;
