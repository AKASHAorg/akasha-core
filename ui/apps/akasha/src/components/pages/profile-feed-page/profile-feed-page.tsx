import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { hasOwn, mapBeamEntryData, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import type { ModalNavigationOptions, Profile } from '@akashaorg/typings/lib/ui';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import { BeamCard, BeamFeed } from '@akashaorg/ui-lib-feed';

export type ProfilePageProps = {
  loggedProfileData: Profile;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const ProfileFeedPage = (props: ProfilePageProps) => {
  const { loggedProfileData, showLoginModal } = props;

  const { t } = useTranslation('app-akasha-integration');
  const { did } = useParams<{ did: string }>();
  const { getRoutingPlugin, navigateToModal } = useRootComponentProps();

  const profileDataQuery = useGetProfileByDidQuery(
    { id: did },
    {
      select: data => (hasOwn(data.node, 'akashaProfile') ? data.node.akashaProfile : null),
    },
  );
  const profileState = profileDataQuery.data;

  const profileUserName = React.useMemo(() => {
    if (profileState && profileState.name) {
      return profileState.name;
    }
    return did;
  }, [profileState, did]);

  const handleEntryFlag = (itemId: string, itemType: EntityTypes) => () => {
    if (!loggedProfileData?.did?.id) {
      return showLoginModal({ modal: { name: 'report-modal', itemId, itemType } });
    }
    navigateToModal({ name: 'report-modal', itemId, itemType });
  };

  const handleEntryRemove = (itemId: string) => {
    navigateToModal({
      name: 'entry-remove-confirmation',
      itemId,
      itemType: EntityTypes.BEAM,
    });
  };

  return (
    <Stack fullWidth={true}>
      <Helmet.Helmet>
        <title>
          {t("{{profileUsername}}'s Page", { profileUsername: profileUserName || '' })} | AKASHA
          World
        </title>
      </Helmet.Helmet>

      <>
        <BeamFeed
          queryKey={`app-akasha-integration_${loggedProfileData?.did?.id}-profile-antenna`}
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
            />
          )}
        />
      </>
    </Stack>
  );
};

export default ProfileFeedPage;
