import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  hasOwn,
  mapBeamEntryData,
  useGetLogin,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { BeamCard, BeamContentResolver, BeamFeed } from '@akashaorg/ui-lib-feed';
import type { ModalNavigationOptions, Profile } from '@akashaorg/typings/lib/ui';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';

export type ProfilePageProps = {
  authenticatedProfile: Profile;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const ProfileFeedPage = (props: ProfilePageProps) => {
  const { authenticatedProfile } = props;

  const { t } = useTranslation('app-akasha-integration');
  const { did } = useParams<{ did: string }>();
  const { getRoutingPlugin } = useRootComponentProps();

  const profileUserName = React.useMemo(() => {
    if (authenticatedProfile && authenticatedProfile.name) {
      return authenticatedProfile.name;
    }
    return did;
  }, [authenticatedProfile, did]);

  return (
    <Stack fullWidth={true}>
      <Helmet.Helmet>
        <title>
          {t("{{profileUsername}}'s Page", { profileUsername: profileUserName || '' })} | AKASHA
          World
        </title>
      </Helmet.Helmet>

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
  );
};

export default ProfileFeedPage;
