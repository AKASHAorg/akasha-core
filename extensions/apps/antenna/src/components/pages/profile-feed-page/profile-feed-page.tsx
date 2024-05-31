import React from 'react';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { useTranslation } from 'react-i18next';
import { hasOwn, useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { BeamContentResolver, BeamFeed } from '@akashaorg/ui-lib-feed';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AkashaBeamStreamModerationStatus } from '@akashaorg/typings/lib/sdk/graphql-types-new';

type ProfileFeedPageProps = {
  profileDID: string;
};

const ProfileFeedPage: React.FC<ProfileFeedPageProps> = props => {
  const { profileDID } = props;
  const { t } = useTranslation('app-antenna');
  const { worldConfig } = useRootComponentProps();
  const {
    data: { authenticatedProfile },
  } = useAkashaStore();

  const profileUserName = React.useMemo(() => {
    if (authenticatedProfile && authenticatedProfile.name) {
      return authenticatedProfile.name;
    }
    return profileDID;
  }, [authenticatedProfile, profileDID]);

  return (
    <HelmetProvider>
      <Stack fullWidth={true}>
        <Helmet>
          <title>
            {t("{{profileUsername}}'s Page", { profileUsername: profileUserName || '' })} |{' '}
            {worldConfig.title}
          </title>
        </Helmet>
        <BeamFeed
          scrollRestorationStorageKey={`app-antenna_${authenticatedProfile?.did?.id}-profile-antenna`}
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
                <BeamContentResolver
                  beamId={itemData.beamID}
                  showNSFWCard={itemData?.status === AkashaBeamStreamModerationStatus.Nsfw}
                />
              );
          }}
        />
      </Stack>
    </HelmetProvider>
  );
};

export default ProfileFeedPage;
