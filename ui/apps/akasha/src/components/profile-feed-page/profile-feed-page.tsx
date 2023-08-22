import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';

import {
  useInfinitePostsByAuthor,
  useGetProfile,
  useEntryNavigation,
} from '@akashaorg/ui-awf-hooks';
import type {
  RootComponentProps,
  Profile,
  ModalNavigationOptions,
  IContentClickDetails,
} from '@akashaorg/typings/ui';
import { EntityTypes } from '@akashaorg/typings/ui';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';

export type ProfilePageProps = RootComponentProps & {
  loggedProfileData: Profile;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const ProfileFeedPage = (props: ProfilePageProps) => {
  const { uiEvents, plugins, navigateToModal, layoutConfig, loggedProfileData, showLoginModal } =
    props;
  const [erroredHooks, setErroredHooks] = React.useState([]);

  const { t } = useTranslation('app-profile');
  const { pubKey } = useParams<{ pubKey: string }>();

  const profileDataQuery = useGetProfile(pubKey, loggedProfileData?.did?.id);
  const profileState = profileDataQuery.data;

  const profileUserName = React.useMemo(() => {
    if (profileState && profileState.name) {
      return profileState.name;
    }
    return pubKey;
  }, [profileState, pubKey]);

  const reqPosts = Promise.resolve([]);

  const handleLoadMore = React.useCallback(() => {
    return undefined;
  }, []);

  const postPages = React.useMemo(() => {
    return undefined;
  }, []);

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
    <Box customStyle="w-full">
      <Helmet.Helmet>
        <title>
          {t("{{profileUsername}}'s Page", { profileUsername: profileUserName || '' })} | AKASHA
          World
        </title>
      </Helmet.Helmet>

      <>
        {false && (
          <ErrorLoader
            type="script-error"
            title="Cannot get posts for this profile"
            details={'placeholder error'}
          />
        )}
        {true && !postPages && <div>There are no posts!</div>}
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
    </Box>
  );
};

export default ProfileFeedPage;
