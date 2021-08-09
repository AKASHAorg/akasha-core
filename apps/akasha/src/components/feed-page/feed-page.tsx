import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';

import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { getFeedCustomEntities } from './feed-page-custom-entities';
import { redirectToPost } from '../../services/routing-service';
import EntryCardRenderer from './entry-card-renderer';
import routes, { POST } from '../../routes';

import { useErrors } from '@akashaproject/ui-awf-hooks';

import { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import { ENTRY_KEY, useInfinitePosts } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import {
  useGetBookmarks,
  useBookmarkPost,
  useBookmarkDelete,
} from '@akashaproject/ui-awf-hooks/lib/use-bookmarks.new';
import { useQueryClient } from 'react-query';

const { Box, Helmet, VirtualList, EditorPlaceholder, EntryList } = DS;

export interface FeedPageProps {
  singleSpa: any;
  logger: any;
  showLoginModal: () => void;
  loggedProfileData?: any;
  loginState: ILoginState;
  onError: (err: IAkashaError) => void;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const { isMobile, showLoginModal, loggedProfileData, loginState, logger } = props;

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const queryClient = useQueryClient();

  const [errorState] = useErrors({ logger });

  const reqPosts = useInfinitePosts(15);
  const postsState = reqPosts.data;
  const ids = React.useMemo(() => {
    const list = [];
    if (!reqPosts.isSuccess) {
      return list;
    }
    postsState.pages.forEach(page => page.results.forEach(postId => list.push(postId)));
    return list;
  }, [reqPosts.isSuccess]);

  const entriesData = React.useMemo(() => {
    const list = {};
    if (!reqPosts.isSuccess) {
      return list;
    }
    postsState.pages.forEach(page =>
      page.results.forEach(
        postId => (list[postId] = queryClient.getQueryData([ENTRY_KEY, postId])),
      ),
    );
    return list;
  }, [reqPosts.data]);

  const bookmarksReq = useGetBookmarks(loginState.ready?.ethAddress);
  const bookmarks = bookmarksReq.data;
  const addBookmark = useBookmarkPost();
  const deleteBookmark = useBookmarkDelete();

  React.useEffect(() => {
    if (Object.keys(errorState).length) {
      logger.error(errorState);
    }
  }, [JSON.stringify(errorState)]);

  // React.useEffect(() => {
  //   if (loginState.currentUserCalled) {
  //     //postsActions.resetPostIds();
  //     if (loginState.ready) {
  //       bookmarkActions.getBookmarks();
  //     }
  //   }
  // }, [JSON.stringify(loginState)]);

  //@Todo: replace this with fetchNextPage() from useInfinitePosts object
  const handleLoadMore = () => {
    if (!reqPosts.isFetching && loginState.currentUserCalled) {
      reqPosts.fetchNextPage();
    }
  };

  const loadItemData = () => {
    //postsActions.getPost(payload.itemId);
  };

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

  const handleEntryRepost = (_withComment: boolean, entryData: any) => {
    props.navigateToModal({ name: 'editor', embedEntry: entryData });
  };

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    props.navigateToModal({ name: 'report-modal', entryId, contentType });
  };

  const handleNavigateToPost = redirectToPost(props.singleSpa.navigateToUrl);

  const handleFlipCard = (_entry: any, _isQuote: boolean) => () => {
    // const modifiedEntry = isQuote
    //   ? { ...entry, quote: { ...entry.quote, reported: false } }
    //   : { ...entry, reported: false };
    //postsActions.updatePostsState(modifiedEntry);
  };

  const handleEntryRemove = (entryId: string) => {
    props.navigateToModal({ name: 'entry-remove-confirmation', entryType: 'Post', entryId });
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Ethereum World</title>
      </Helmet>
      <EntryList
        pages={postsState.pages}
        itemCard={
          <EntryCardRenderer
            logger={logger}
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
            awaitingModerationLabel={t(
              'You have reported this content. It is awaiting moderation.',
            )}
            moderatedContentLabel={t('This content has been moderated')}
            ctaLabel={t('See it anyway')}
            handleFlipCard={handleFlipCard}
            onEntryRemove={handleEntryRemove}
            removeEntryLabel={t('Delete Post')}
            removedByMeLabel={t('You deleted this post')}
            removedByAuthorLabel={t('This post was deleted by its author')}
          />
        }
        onLoadMore={handleLoadMore}
      />
      {/** <VirtualList
        items={ids}
        itemsData={entriesData}
        loadMore={handleLoadMore}
        loadItemData={loadItemData}
        hasMoreItems={!!reqPosts.hasNextPage}
        usePlaceholders={true}
        listHeader={
          loginState.ethAddress ? (
            <EditorPlaceholder
              ethAddress={loginState.ethAddress}
              onClick={handleShowEditor}
              avatar={loggedProfileData?.avatar}
            />
          ) : (
            <>
              {<Parcel
                config={loginWidget.loadingFn}
                wrapWith="div"
                sdkModules={props.sdkModules}
                logger={props.logger}
                layout={props.layoutConfig}
                globalChannel={props.globalChannel}
                i18n={props.i18n}
                mountParcel={props.singleSpa.mountRootParcel}
              />}
            </>
          )
        }
        itemCard={
          <EntryCardRenderer
            logger={logger}
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
            awaitingModerationLabel={t(
              'You have reported this content. It is awaiting moderation.',
            )}
            moderatedContentLabel={t('This content has been moderated')}
            ctaLabel={t('See it anyway')}
            handleFlipCard={handleFlipCard}
            onEntryRemove={handleEntryRemove}
            removeEntryLabel={t('Delete Post')}
            removedByMeLabel={t('You deleted this post')}
            removedByAuthorLabel={t('This post was deleted by its author')}
            uiEvents={props.uiEvents}
          />
        }
        customEntities={getFeedCustomEntities({
          logger,
          isMobile,
          feedItems: ids,
          loggedEthAddress: loginState.ethAddress,
          pendingEntries: [],
        })}
      /> */}
    </Box>
  );
};

export default FeedPage;
