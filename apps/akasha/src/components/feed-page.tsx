import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import {
  ILoadItemDataPayload,
  ILoadItemsPayload,
} from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { fetchFeedItemData, fetchFeedItems } from '../services/feed-service';

const { Helmet, VirtualList, Box, ErrorInfoCard, ErrorLoader, EntryCardLoading, EntryCard } = DS;

export interface FeedPageProps {
  globalChannel: any;
  sdkModules: any;
  logger: any;
}
interface IFeedState {
  isFeedLoading: boolean;
  feedItems: string[];
  feedItemData: {
    [key: string]: any;
  };
}

const feedStateReducer = (state: IFeedState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case 'FEED_LOAD_SUCCESS':
      return { ...state, isFeedLoading: false };
    case 'LOAD_FEED_ITEMS':
      return { ...state, isFeedLoading: true };
    case 'LOAD_FEED_ITEMS_SUCCESS':
      return { ...state, feedItems: state.feedItems.concat(action.payload), isFeedLoading: false };
    case 'LOAD_FEED_ITEM_DATA_SUCCESS':
      return {
        ...state,
        feedItemData: { ...state.feedItemData, [action.payload.entryId]: action.payload },
      };
    default:
      throw new Error(`Could not find action with type: ${action.type}`);
  }
};

const FeedPage: React.FC<FeedPageProps> = _props => {
  const [feedState, dispatch] = React.useReducer(feedStateReducer, {
    isFeedLoading: true,
    feedItems: [],
    feedItemData: {},
  });

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const handleLoadMore = async (payload: ILoadItemsPayload) => {
    const resp = await fetchFeedItems(payload);
    if (resp) {
      dispatch({
        type: 'LOAD_FEED_ITEMS_SUCCESS',
        payload: resp.items.map(i => i.entryId),
      });
    }
  };

  const loadItemData = async (payload: ILoadItemDataPayload) => {
    const resp = await fetchFeedItemData({ entryId: payload.itemId });
    if (resp) {
      dispatch({
        type: 'LOAD_FEED_ITEM_DATA_SUCCESS',
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
        type: 'LOAD_FEED_ITEMS_SUCCESS',
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
  const handleLinkCopy = () => {
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
    <Box fill={true}>
      <Helmet>
        <title>AKASHA Feed | Ethereum.world</title>
      </Helmet>
      <VirtualList
        items={feedState.feedItems}
        itemsData={feedState.feedItemData}
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
                        onLinkCopy={handleLinkCopy}
                        onClickReplies={handleClickReplies}
                        handleFollow={handleFollow}
                        handleUnfollow={handleUnfollow}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </ErrorInfoCard>
        )}
      />
    </Box>
  );
};

export default FeedPage;
