import * as React from 'react';
import {
  ILoadItemsPayload,
  ILoadItemDataPayload,
} from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { useTranslation } from 'react-i18next';
import { useParams, useRouteMatch } from 'react-router-dom';
import { fetchFeedItems, fetchFeedItemData } from '../services/feed-service';
import { redirectToPost } from '../services/routing-service';
import DS from '@akashaproject/design-system';

const { Helmet, VirtualList, ErrorInfoCard, ErrorLoader, EntryCardLoading, EntryCard } = DS;

interface IPostsListProps {
  channels: any;
  logger: any;
  globalChannel: any;
  navigateToUrl: (path: string) => void;
}

interface IPostsState {
  isLoading: boolean;
  postItems: string[];
  postItemData: {
    [key: string]: any;
  };
}
const postsStateReducer = (state: IPostsState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case 'POSTS_LOAD_SUCCESS':
      return { ...state, isLoading: false };
    case 'LOAD_POST_ITEMS':
      return { ...state, isLoading: true };
    case 'LOAD_POST_ITEMS_SUCCESS':
      return { ...state, postItems: state.postItems.concat(action.payload), isLoading: false };
    case 'LOAD_POST_ITEM_DATA_SUCCESS':
      return {
        ...state,
        postItemData: { ...state.postItemData, [action.payload.entryId]: action.payload },
      };
    default:
      throw new Error(`Could not find action with type: ${action.type}`);
  }
};

const PostsList: React.FC<IPostsListProps> = props => {
  const { userId } = useParams<{ userId: string }>();

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [postsState, dispatch] = React.useReducer(postsStateReducer, {
    isLoading: true,
    postItems: [],
    postItemData: {},
  });

  const { path } = useRouteMatch();
  const isMyPosts = !userId && path.split('/')[path.split('/').length - 1] === 'my-posts';

  const handleLoadMore = async (payload: ILoadItemsPayload) => {
    const resp = await fetchFeedItems(payload);
    if (resp) {
      dispatch({
        type: 'LOAD_POST_ITEMS_SUCCESS',
        payload: resp.items.map(i => i.entryId),
      });
    }
  };

  const loadItemData = async (payload: ILoadItemDataPayload) => {
    const resp = await fetchFeedItemData({ entryId: payload.itemId });
    if (resp) {
      dispatch({
        type: 'LOAD_POST_ITEM_DATA_SUCCESS',
        payload: resp,
      });
    }
  };

  const onInitialLoad = async (payload: ILoadItemsPayload) => {
    const response = await fetchFeedItems({
      start: payload.start,
      limit: payload.limit,
      reverse: payload.reverse,
    });
    if (response.items.length) {
      dispatch({
        type: 'LOAD_POST_ITEMS_SUCCESS',
        payload: response.items.map(i => i.entryId),
      });
    }
  };
  const handleAvatarClick = () => {
    /* todo */
  };
  const handleEntryBookmark = () => {
    /* todo */
  };
  const handleEntryRepost = () => {
    /* todo */
  };
  const handleEntryShare = () => {
    /* todo */
  };
  const handleEntryFlag = () => {
    /* todo */
  };
  const handleClickReplies = () => {
    /* todo */
  };
  const handleFollow = () => {
    /* todo */
  };
  const handleUnfollow = () => {
    /* todo */
  };

  return (
    <>
      <Helmet>
        <title>AKASHA Posts | Ethereum.world</title>
      </Helmet>
      {isMyPosts && (
        <VirtualList
          items={postsState.postItems}
          itemsData={postsState.postItemData}
          loadMore={handleLoadMore}
          loadItemData={loadItemData}
          loadInitialFeed={onInitialLoad}
          hasMoreItems={true}
          getItemCard={({ itemData, isBookmarked }) => (
            <ErrorInfoCard errors={{}}>
              {(errorMessages, hasCriticalErrors) => (
                <>
                  {errorMessages && (
                    <ErrorLoader
                      type="script-error"
                      title={t('There was an error loading the entry')}
                      details={t('We cannot show this entry right now')}
                      devDetails={errorMessages}
                    />
                  )}
                  {!hasCriticalErrors && (
                    <>
                      {(!itemData || !itemData.author?.ethAddress) && <EntryCardLoading />}
                      {itemData && itemData.author.ethAddress && (
                        <EntryCard
                          isBookmarked={isBookmarked}
                          entryData={itemData}
                          sharePostLabel={t('Share Post')}
                          shareTextLabel={t('Share this post with your friends')}
                          sharePostUrl={'https://ethereum.world'}
                          onClickAvatar={handleAvatarClick}
                          onEntryBookmark={handleEntryBookmark}
                          repliesLabel={t('Replies')}
                          repostsLabel={t('Reposts')}
                          repostLabel={t('Repost')}
                          repostWithCommentLabel={t('Repost with comment')}
                          shareLabel={t('Share')}
                          copyLinkLabel={t('Copy Link')}
                          copyIPFSLinkLabel={t('Copy IPFS Link')}
                          flagAsLabel={t('Flag as inappropiate')}
                          loggedProfileEthAddress={'0x00123123123123'}
                          locale={locale}
                          style={{ height: 'auto' }}
                          bookmarkLabel={t('Save')}
                          bookmarkedLabel={t('Saved')}
                          onRepost={handleEntryRepost}
                          onEntryShare={handleEntryShare}
                          onEntryFlag={handleEntryFlag}
                          onClickReplies={handleClickReplies}
                          handleFollow={handleFollow}
                          handleUnfollow={handleUnfollow}
                          onContentClick={redirectToPost(props.navigateToUrl)}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </ErrorInfoCard>
          )}
        />
      )}
    </>
  );
};

export default PostsList;
