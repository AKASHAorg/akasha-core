import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';
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

  const reqPosts = useInfinitePostsByAuthor(
    pubKey,
    15,
    !!pubKey && !erroredHooks.includes('useInfinitePostsByAuthor'),
  );

  React.useEffect(() => {
    if (reqPosts.status === 'error' && !erroredHooks.includes('useInfinitePostsByAuthor')) {
      setErroredHooks(['useInfinitePostsByAuthor']);
    }
  }, [reqPosts, erroredHooks]);

  const postPages = React.useMemo(() => {
    if (reqPosts.data) {
      return reqPosts.data.pages;
    }
    return [];
  }, [reqPosts.data]);

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
          {t("{{profileUsername}}'s Page", { profileUsername: profileUserName || '' })} | Ethereum
          World
        </title>
      </Helmet.Helmet>

      <>
        {reqPosts.isError && reqPosts.error && (
          <ErrorLoader
            type="script-error"
            title="Cannot get posts for this profile"
            details={(reqPosts.error as Error).message}
          />
        )}
        {reqPosts.isSuccess && !postPages && <div>There are no posts!</div>}
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
