import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useGetProfile } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import useLoginState, { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import FeedWidget from '@akashaproject/ui-widget-feed/lib/components/App';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
// import { useFollowers } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';

import { ProfilePageHeader } from '../profile-cards/profile-page-header';
import menuRoute, { MY_PROFILE } from '../../routes';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { ENTRY_KEY, useInfinitePostsByAuthor } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { useQueryClient } from 'react-query';
import { UserProfile_Response } from '@akashaproject/awf-sdk/typings/lib/interfaces/responses';

const { Box, Helmet, ErrorLoader } = DS;

export interface ProfilePageProps extends RootComponentProps {
  loggedProfileData: UserProfile_Response;
  showLoginModal: () => void;
  loginState: ILoginState;
}

const ProfilePage = (props: ProfilePageProps) => {
  const { loggedProfileData, showLoginModal } = props;

  const location = useLocation();
  const queryClient = useQueryClient();

  const { pubKey } = useParams<{ pubKey: string }>();

  const publicKey = React.useMemo(() => {
    if (location.pathname.includes(menuRoute[MY_PROFILE])) {
      if (loggedProfileData && loggedProfileData.pubKey) {
        return loggedProfileData.pubKey;
      }
      return undefined;
    }
    return pubKey;
  }, [pubKey, loggedProfileData, location.pathname]);

  const profileDataQuery = useGetProfile(publicKey);
  const profileState = profileDataQuery.data;

  const [loginState] = useLoginState({});
  const reqPosts = useInfinitePostsByAuthor(publicKey, 15, !!publicKey);

  const { t, i18n } = useTranslation();

  const handleLoadMore = React.useCallback(() => {
    if (!reqPosts.isLoading && reqPosts.hasNextPage && loginState.currentUserCalled) {
      reqPosts.fetchNextPage();
    }
  }, [reqPosts, loginState.currentUserCalled]);

  const handleNavigation = (itemType: ItemTypes, details: IContentClickDetails) => {
    let url;
    switch (itemType) {
      case ItemTypes.PROFILE:
        if (details.entryId === pubKey) {
          return;
        }
        url = `/profile/${details.entryId}`;
        break;
      case ItemTypes.TAG:
        url = `/social-app/tags/${details.entryId}`;
        break;
      case ItemTypes.ENTRY:
        url = `/social-app/post/${details.entryId}`;
        break;
      case ItemTypes.COMMENT:
        /* Navigate to parent post because we don't have the comment page yet */
        url = `/social-app/post/${
          queryClient.getQueryData<{ postId: string }>([ENTRY_KEY, details.entryId]).postId
        }`;
        break;
      default:
        break;
    }
    props.singleSpa.navigateToUrl(url);
  };

  const profileUserName = React.useMemo(() => {
    if (profileState && profileState.name) {
      return profileState.name;
    }
    return pubKey;
  }, [profileState, pubKey]);

  const postPages = React.useMemo(() => {
    if (reqPosts.data) {
      return reqPosts.data.pages;
    }
    return [];
  }, [reqPosts.data]);

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    props.navigateToModal({ name: 'report-modal', entryId, contentType });
  };

  const handleFlipCard = (_entry: any, _isQuote: boolean) => () => {
    // const modifiedEntry = isQuote
    //   ? { ...entry, quote: { ...entry.quote, reported: false } }
    //   : { ...entry, reported: false };
    // postsActions.updatePostsState(modifiedEntry);
  };

  const handleEntryRemove = (entryId: string) => {
    props.navigateToModal({ name: 'entry-remove-confirmation', entryId, entryType: 'Post' });
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>
          {t("{{profileUsername}}'s Page", { profileUsername: profileUserName || '' })} | Ethereum
          World
        </title>
      </Helmet>
      {profileDataQuery.status === 'loading' && <></>}
      {profileDataQuery.status === 'success' && (
        <ProfilePageHeader
          {...props}
          profileState={profileState}
          profileId={pubKey}
          loggedUserEthAddress={loginState.ethAddress}
        />
      )}
      {reqPosts.status === 'error' && reqPosts.error && (
        <ErrorLoader
          type="script-error"
          title="Cannot get posts for this profile"
          details={(reqPosts.error as Error).message}
        />
      )}
      {reqPosts.status === 'success' && !postPages && <div>There are no posts!</div>}
      {reqPosts.status === 'success' && postPages && (
        <FeedWidget
          itemType={ItemTypes.ENTRY}
          logger={props.logger}
          onLoadMore={handleLoadMore}
          getShareUrl={(itemId: string) => `${window.location.origin}/social-app/post/${itemId}`}
          pages={postPages}
          requestStatus={reqPosts.status}
          ethAddress={loginState.ethAddress}
          onNavigate={handleNavigation}
          singleSpaNavigate={props.singleSpa.navigateToUrl}
          navigateToModal={props.navigateToModal}
          onLoginModalOpen={showLoginModal}
          hasNextPage={reqPosts.hasNextPage}
          profilePubKey={pubKey}
          loggedProfile={loggedProfileData}
          contentClickable={true}
          onEntryFlag={handleEntryFlag}
          handleFlipCard={handleFlipCard}
          onEntryRemove={handleEntryRemove}
          removeEntryLabel={t('Delete Post')}
          removedByMeLabel={t('You deleted this post')}
          removedByAuthorLabel={t('This post was deleted by its author')}
          uiEvents={props.uiEvents}
          itemSpacing={8}
          locale={i18n.languages[0]}
        />
      )}
    </Box>
  );
};

export default ProfilePage;
