import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  hasOwn,
  mapBeamEntryData,
  useGetLoginProfile,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { BeamCard, BeamFeed } from '@akashaorg/ui-lib-feed';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Helmet, HelmetProvider } from 'react-helmet-async';

type ProfileFeedPageProps = {
  profileDid: string;
};

const ProfileFeedPage: React.FC<ProfileFeedPageProps> = props => {
  const { profileDid } = props;
  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin } = useRootComponentProps();
  const authenticatedProfileReq = useGetLoginProfile();
  const authenticatedProfile = authenticatedProfileReq?.akashaProfile;
  const profileUserName = React.useMemo(() => {
    if (authenticatedProfile && authenticatedProfile.name) {
      return authenticatedProfile.name;
    }
    return profileDid;
  }, [authenticatedProfile, profileDid]);

  return (
    <HelmetProvider>
      <Stack fullWidth={true}>
        <Helmet>
          <title>
            {t("{{profileUsername}}'s Page", { profileUsername: profileUserName || '' })} | AKASHA
            World
          </title>
        </Helmet>

        <BeamFeed
          queryKey={`app-akasha-integration_${authenticatedProfile?.did?.id}-profile-antenna`}
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
                    getRoutingPlugin().navigateTo({
                      appName: '@akashaorg/app-akasha-integration',
                      getNavigationUrl: navRoutes => `${navRoutes.Beam}/${itemData.node.id}`,
                    })
                  }
                  onReflect={() =>
                    getRoutingPlugin().navigateTo({
                      appName: '@akashaorg/app-akasha-integration',
                      getNavigationUrl: navRoutes =>
                        `${navRoutes.Beam}/${itemData.node.id}${navRoutes.Reflect}`,
                    })
                  }
                  showNSFWCard={itemData.node?.nsfw}
                />
              );
          }}
        />
      </Stack>
    </HelmetProvider>
  );
};

export default ProfileFeedPage;
