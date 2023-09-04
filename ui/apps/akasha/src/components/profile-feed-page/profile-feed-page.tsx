import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';

import { hasOwn, useEntryNavigation } from '@akashaorg/ui-awf-hooks';
import type { RootComponentProps, Profile, ModalNavigationOptions } from '@akashaorg/typings/ui';
import { EntityTypes } from '@akashaorg/typings/ui';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

export type ProfilePageProps = RootComponentProps & {
  loggedProfileData: Profile;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const ProfileFeedPage = (props: ProfilePageProps) => {
  const { uiEvents, plugins, navigateToModal, layoutConfig, loggedProfileData, showLoginModal } =
    props;

  const { t } = useTranslation('app-profile');
  const { did } = useParams<{ did: string }>();

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
    props.navigateToModal({ name: 'report-modal', itemId, itemType });
  };

  const handleEntryRemove = (itemId: string) => {
    props.navigateToModal({
      name: 'entry-remove-confirmation',
      itemId,
      itemType: EntityTypes.BEAM,
    });
  };

  const handleRebeam = (withComment: boolean, beamId: string) => {
    if (!loggedProfileData?.did.id) {
      navigateToModal({ name: 'login' });
    } else {
      plugins['@akashaorg/app-routing'].navigateTo?.({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: () => `/feed?repost=${beamId}`,
      });
    }
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
        <FeedWidget
          queryKey="akasha-profile-beams-query-key"
          modalSlotId={layoutConfig.modalSlotId}
          itemType={EntityTypes.BEAM}
          loggedProfileData={loggedProfileData}
          navigateToModal={navigateToModal}
          onLoginModalOpen={showLoginModal}
          contentClickable={true}
          onEntryFlag={handleEntryFlag}
          onEntryRemove={handleEntryRemove}
          uiEvents={uiEvents}
          itemSpacing={8}
          i18n={plugins['@akashaorg/app-translation']?.translation?.i18n}
          onRebeam={handleRebeam}
          onNavigate={useEntryNavigation(plugins['@akashaorg/app-routing']?.routing?.navigateTo)}
        />
      </>
    </Stack>
  );
};

export default ProfileFeedPage;
