import React from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { ModalNavigationOptions, EntityTypes } from '@akashaorg/typings/lib/ui';
import { useAnalytics, useEntryNavigation, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';
import { useParams } from 'react-router-dom';

export type ProfileBeamsPageProps = {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const ProfileBeamsPage: React.FC<ProfileBeamsPageProps> = props => {
  const { showLoginModal } = props;

  const { navigateToModal, getRoutingPlugin } = useRootComponentProps();

  const [analyticsActions] = useAnalytics();
  const { t } = useTranslation('app-profile');

  const { profileId } = useParams<{
    profileId: string;
  }>();
  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });
  const loggedProfileData = profileDataReq.data;

  const handleEntryFlag = React.useCallback(
    (itemId: string, itemType: EntityTypes) => () => {
      if (!loggedProfileData?.did) {
        return showLoginModal({ modal: { name: 'report-modal', itemId, itemType } });
      }
      navigateToModal({ name: 'report-modal', itemId, itemType });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedProfileData?.did?.id],
  );

  const handleEntryRemove = React.useCallback((itemId: string) => {
    navigateToModal({
      name: 'entry-remove-confirmation',
      itemType: EntityTypes.BEAM,
      itemId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRebeam = (withComment: boolean, beamId: string) => {
    if (!loggedProfileData.did) {
      navigateToModal({ name: 'login' });
    } else {
      getRoutingPlugin().navigateTo?.({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: () => `/feed?repost=${beamId}`,
      });
    }
  };

  return (
    <Stack direction="column" spacing="gap-y-4" fullWidth>
      <FeedWidget
        queryKey="akashaorg-profile-page-query"
        itemType={EntityTypes.BEAM}
        loggedProfileData={loggedProfileData}
        onLoginModalOpen={showLoginModal}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        onEntryRemove={handleEntryRemove}
        itemSpacing={8}
        onRebeam={handleRebeam}
        trackEvent={analyticsActions.trackEvent}
        onNavigate={useEntryNavigation(getRoutingPlugin().navigateTo)}
        newItemsPublishedLabel={t('New Beams published recently')}
        did={profileId}
      />
    </Stack>
  );
};

export default ProfileBeamsPage;
