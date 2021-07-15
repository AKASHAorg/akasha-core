import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import {
  ILoadItemDataPayload,
  ILoadItemsPayload,
} from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { getFeedCustomEntities } from './feed-page-custom-entities';
import { redirectToPost } from '../../services/routing-service';
import EntryCardRenderer from './entry-card-renderer';
import routes, { POST } from '../../routes';

import { useBookmarks, useErrors, usePosts } from '@akashaproject/ui-awf-hooks';

import { PublishPostData } from '@akashaproject/ui-awf-hooks/lib/use-posts';

import { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import { useCreatePost, useInfinitePosts } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { buildPublishObject, mapEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';

// import { useInfinitePosts } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';

const { Box, Helmet, VirtualList, EditorPlaceholder } = DS;

export interface FeedPageProps {
  singleSpa: any;
  logger: any;
  showLoginModal: () => void;
  loggedProfileData?: any;
  loginState: ILoginState;
  onError: (err: IAkashaError) => void;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const { isMobile, showLoginModal, loggedProfileData, loginState, onError, logger } = props;

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [bookmarkState, bookmarkActions] = useBookmarks({
    onError,
  });
  const [errorState, errorActions] = useErrors({ logger });

  // @Todo: replace this with useInfinitePosts()
  // const [postsState, postsActions] = usePosts({
  //   user: loginState.ethAddress,
  //   onError: errorActions.createError,
  // });

  const reqPosts = useInfinitePosts(15);
  const postsState = reqPosts.data;
  const ids = React.useMemo(() => {
    const list = [];
    if (!reqPosts.isSuccess) {
      return list;
    }
    postsState.pages.forEach(el => el.results.forEach(el1 => list.push(el1._id)));
    return list;
  }, [reqPosts.isSuccess]);

  const entriesData = React.useMemo(() => {
    const list = {};
    if (!reqPosts.isSuccess) {
      return list;
    }
    postsState.pages.forEach(el =>
      el.results.forEach(el1 => (list[el1._id] = mapEntry(el1, 'https://hub.textile.io/ipfs'))),
    );
    return list;
  }, [reqPosts.isSuccess]);

  React.useEffect(() => {
    if (Object.keys(errorState).length) {
      logger.error(errorState);
    }
  }, [JSON.stringify(errorState)]);

  React.useEffect(() => {
    if (loginState.currentUserCalled) {
      //postsActions.resetPostIds();
      if (loginState.ready) {
        bookmarkActions.getBookmarks();
      }
    }
  }, [JSON.stringify(loginState)]);

  // React.useEffect(() => {
  //   if (
  //     !postsState.postIds.length &&
  //     !postsState.isFetchingPosts &&
  //     postsState.totalItems === null
  //   ) {
  //     postsActions.getPosts({ limit: 5 });
  //   }
  // }, [postsState.postIds.length, postsState.isFetchingPosts]);

  //@Todo: replace this with fetchNextPage() from useInfinitePosts object
  const handleLoadMore = (_payload: ILoadItemsPayload) => {
    // const req: { limit: number; offset?: string } = {
    //   limit: payload.limit,
    // };
    if (!reqPosts.isFetching && loginState.currentUserCalled) {
      reqPosts.fetchNextPage().then(d => console.log('fetched next page', d));
    }
  };

  const loadItemData = (_payload: ILoadItemDataPayload) => {
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
    if (bookmarkState.bookmarks.findIndex(bm => bm.entryId === entryId) >= 0) {
      return bookmarkActions.removeBookmark(entryId);
    }
    return bookmarkActions.bookmarkPost(entryId);
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

  const publishPost = useCreatePost();
  const handleEntryPublish = async (data: PublishPostData) => {
    if (!loginState.ethAddress && !loginState.pubKey) {
      showLoginModal();
      return;
    }
    publishPost.mutate(buildPublishObject(data));
    //postsActions.optimisticPublishPost(data, loggedProfileData, currentEmbedEntry);
    closeEditorModal();
  };

  const handleFlipCard = (entry: any, isQuote: boolean) => () => {
    // const modifiedEntry = isQuote
    //   ? { ...entry, quote: { ...entry.quote, reported: false } }
    //   : { ...entry, reported: false };
    //postsActions.updatePostsState(modifiedEntry);
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Ethereum World</title>
      </Helmet>
      <VirtualList
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
              avatar={loggedProfileData.avatar}
            />
          ) : (
            <>
              {/* <Parcel
                config={loginWidget.loadingFn}
                wrapWith="div"
                sdkModules={props.sdkModules}
                logger={props.logger}
                layout={props.layoutConfig}
                globalChannel={props.globalChannel}
                i18n={props.i18n}
                mountParcel={props.singleSpa.mountRootParcel}
              /> */}
            </>
          )
        }
        itemCard={
          <EntryCardRenderer
            logger={logger}
            bookmarkState={bookmarkState}
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
          />
        }
        customEntities={getFeedCustomEntities({
          logger,
          isMobile,
          feedItems: ids,
          loggedEthAddress: loginState.ethAddress,
          pendingEntries: [],
        })}
      />
    </Box>
  );
};

export default FeedPage;
