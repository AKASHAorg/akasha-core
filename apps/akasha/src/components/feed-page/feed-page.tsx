import * as React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { IPublishData } from '@akashaproject/ui-awf-typings/lib/entry';
import {
  useGetBookmarks,
  useBookmarkPost,
  useBookmarkDelete,
} from '@akashaproject/ui-awf-hooks/lib/use-bookmarks.new';
import {
  useInfinitePosts,
  CREATE_POST_MUTATION_KEY,
} from '@akashaproject/ui-awf-hooks/lib/use-posts.new';

import { useMutationListener } from '@akashaproject/ui-awf-hooks/lib/use-query-listener';
import { createPendingEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';
import { ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';

import EntryCardRenderer from './entry-card-renderer';

import routes, { POST } from '../../routes';
import { redirectToPost } from '../../services/routing-service';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';

const { Box, Helmet, EditorPlaceholder, EntryList, EntryCard, EntryPublishErrorCard } = DS;

export interface FeedPageProps {
  showLoginModal: (redirectTo?: ModalNavigationOptions) => void;
  loggedProfileData?: IProfileData;
  loginState: ILoginState;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const { showLoginModal, loggedProfileData, loginState } = props;

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const createPostMutation = useMutationListener<IPublishData>(CREATE_POST_MUTATION_KEY);

  const postsReq = useInfinitePosts(15);

  const bookmarksReq = useGetBookmarks(loginState.ready?.ethAddress);
  const bookmarks = bookmarksReq.data;
  const addBookmark = useBookmarkPost();
  const deleteBookmark = useBookmarkDelete();

  //@Todo: replace this with fetchNextPage() from useInfinitePosts object
  const handleLoadMore = React.useCallback(() => {
    if (!postsReq.isLoading && postsReq.hasNextPage && loginState.currentUserCalled) {
      postsReq.fetchNextPage();
    }
  }, [postsReq, loginState.currentUserCalled]);

  const postPages = React.useMemo(() => {
    if (postsReq.data) {
      return postsReq.data.pages;
    }
    return [];
  }, [postsReq.data]);

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, authorPubKey: string) => {
    props.singleSpa.navigateToUrl(`/profile/${authorPubKey}`);
    ev.preventDefault();
  };
  const handleMentionClick = (profilePubKey: string) => {
    props.singleSpa.navigateToUrl(`/profile/${profilePubKey}`);
  };

  const handleTagClick = (name: string) => {
    props.singleSpa.navigateToUrl(`/social-app/tags/${name}`);
  };

  const handleEntryBookmark = (entryId: string) => {
    if (!loginState.pubKey) {
      return showLoginModal();
    }
    if (bookmarks?.findIndex(bm => bm.entryId === entryId) >= 0) {
      return deleteBookmark.mutate(entryId);
    }

    return addBookmark.mutate(entryId);
  };

  const handleShowEditor = () => {
    props.navigateToModal({ name: 'editor' });
  };

  const handleEntryRepost = (_withComment: boolean, entryId: string) => {
    props.navigateToModal({ name: 'editor', embedEntry: entryId });
  };

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    if (!loginState.pubKey) {
      return showLoginModal({ name: 'report-modal', entryId, contentType });
    }
    props.navigateToModal({ name: 'report-modal', entryId, contentType });
  };

  const handleNavigateToPost = redirectToPost(props.singleSpa.navigateToUrl);

  const handleEntryRemove = (entryId: string) => {
    props.navigateToModal({
      name: 'entry-remove-confirmation',
      entryType: ItemTypes.ENTRY,
      entryId,
    });
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Ethereum World</title>
      </Helmet>
      {loginState.ethAddress && (
        <EditorPlaceholder
          ethAddress={loginState.ethAddress}
          onClick={handleShowEditor}
          avatar={loggedProfileData?.avatar}
          style={{ marginBottom: '0.5rem' }}
        />
      )}
      {createPostMutation && createPostMutation.state.status === 'error' && (
        <EntryPublishErrorCard message={t('Cannot publish this entry. Please try again later!')} />
      )}
      {createPostMutation && createPostMutation.state.status === 'loading' && (
        <EntryCard
          style={{ backgroundColor: '#4e71ff0f', marginBottom: '0.5rem' }}
          entryData={createPendingEntry(
            loggedProfileData,
            createPostMutation.state.variables,
            createPostMutation.state.variables.metadata.quote,
          )}
          sharePostLabel={t('Share Post')}
          shareTextLabel={t('Share this post with your friends')}
          repliesLabel={t('Replies')}
          repostsLabel={t('Reposts')}
          repostLabel={t('Repost')}
          repostWithCommentLabel={t('Repost with comment')}
          shareLabel={t('Share')}
          copyLinkLabel={t('Copy Link')}
          flagAsLabel={t('Report Post')}
          loggedProfileEthAddress={loggedProfileData.ethAddress}
          locale={locale || 'en'}
          bookmarkLabel={t('Save')}
          bookmarkedLabel={t('Saved')}
          profileAnchorLink={'/profile'}
          repliesAnchorLink={routes[POST]}
          contentClickable={false}
          hidePublishTime={true}
          disableActions={true}
        />
      )}
      <EntryList
        pages={postPages}
        itemSpacing={8}
        status={postsReq.status}
        hasNextPage={postsReq.hasNextPage}
        itemCard={
          <EntryCardRenderer
            uiEvents={props.uiEvents}
            bookmarkState={bookmarksReq}
            ethAddress={loginState.ethAddress}
            locale={locale}
            onBookmark={handleEntryBookmark}
            onNavigate={handleNavigateToPost}
            singleSpaNavigate={props.singleSpa.navigateToUrl}
            onFlag={handleEntryFlag}
            onRepost={handleEntryRepost}
            sharePostUrl={`${window.location.origin}${routes[POST]}/`}
            onAvatarClick={handleAvatarClick}
            onMentionClick={handleMentionClick}
            onTagClick={handleTagClick}
            contentClickable={true}
            headerTextLabel={t('You reported this post for the following reason')}
            footerTextLabel={t('It is awaiting moderation.')}
            moderatedContentLabel={t('This content has been moderated')}
            ctaLabel={t('See it anyway')}
            onEntryRemove={handleEntryRemove}
            removeEntryLabel={t('Delete Post')}
            removedByMeLabel={t('You deleted this post')}
            removedByAuthorLabel={t('This post was deleted by its author')}
          />
        }
        onLoadMore={handleLoadMore}
      />
    </Box>
  );
};

export default FeedPage;
