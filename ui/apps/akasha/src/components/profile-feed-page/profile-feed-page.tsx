import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';
import { useInfinitePostsByAuthor, useGetProfile } from '@akashaorg/ui-awf-hooks';
import {
  RootComponentProps,
  EntityTypes,
  Profile,
  ModalNavigationOptions,
} from '@akashaorg/typings/ui';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';

export interface ProfilePageProps extends RootComponentProps {
  loggedProfileData: Profile;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
}

const ProfileFeedPage = (props: ProfilePageProps) => {
  const { loggedProfileData, showLoginModal } = props;
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

  const handleLoadMore = React.useCallback(() => {
    if (!reqPosts.isLoading && reqPosts.hasNextPage) {
      reqPosts.fetchNextPage();
    }
  }, [reqPosts]);
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
      itemType: EntityTypes.POST,
    });
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
        {reqPosts.isError && reqPosts.error && (
          <ErrorLoader
            type="script-error"
            title="Cannot get posts for this profile"
            details={(reqPosts.error as Error).message}
          />
        )}
        {reqPosts.isSuccess && !postPages && <div>There are no posts!</div>}
        {reqPosts.isSuccess && postPages && (
          <FeedWidget
            modalSlotId={props.layoutConfig.modalSlotId}
            itemType={EntityTypes.POST}
            logger={props.logger}
            onLoadMore={handleLoadMore}
            getShareUrl={(itemId: string) =>
              `${window.location.origin}/@akashaorg/app-akasha-integration/post/${itemId}`
            }
            pages={postPages}
            requestStatus={reqPosts.status}
            loggedProfileData={loggedProfileData}
            navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
            navigateToModal={props.navigateToModal}
            onLoginModalOpen={showLoginModal}
            hasNextPage={reqPosts.hasNextPage}
            contentClickable={true}
            onEntryFlag={handleEntryFlag}
            onEntryRemove={handleEntryRemove}
            removeEntryLabel={t('Delete Post')}
            removedByMeLabel={t('You deleted this post')}
            removedByAuthorLabel={t('This post was deleted by its author')}
            parentIsProfilePage={true}
            uiEvents={props.uiEvents}
            itemSpacing={8}
            i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}
          />
        )}
      </>
    </Box>
  );
};

export default ProfileFeedPage;
