import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import {
  ILoadItemDataPayload,
  ILoadItemsPayload,
} from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { fetchFeedItemData, fetchFeedItems } from '../../services/feed-service';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import useFeedReducer from '../../hooks/use-feed-reducer';
import { addToIPFS, getPending, publishEntry } from '../../services/posting-service';
import { getFeedCustomEntities } from './feed-page-custom-entities';
import useEntryPublisher from '../../hooks/use-entry-publisher';

const { Helmet, VirtualList, Box, ErrorInfoCard, ErrorLoader, EntryCardLoading, EntryCard } = DS;

export interface FeedPageProps {
  globalChannel: any;
  sdkModules: any;
  logger: any;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const { isMobile } = props;
  const [feedState, feedStateActions] = useFeedReducer({});

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [pendingEntries, pendingActions] = useEntryPublisher({
    publishEntry: publishEntry,
    onPublishComplete: _localId => {
      /* TODO: merge the entry with all entries... */
      /* should consider publishing date? */
    },
    ethAddress: '0x123someethaddress',
    addToIPFS: addToIPFS,
    getPendingEntries: getPending,
  });

  const handleLoadMore = async (payload: ILoadItemsPayload) => {
    const resp = await fetchFeedItems(payload);
    if (resp.items.length) {
      feedStateActions.setFeedItems(resp);
    }
  };

  const loadItemData = async (payload: ILoadItemDataPayload) => {
    const resp = await fetchFeedItemData({ entryId: payload.itemId });
    if (resp) {
      feedStateActions.setFeedItemData(resp);
    }
  };

  const onInitialLoad = async (payload: ILoadItemsPayload) => {
    const response = await fetchFeedItems({
      start: payload.start,
      limit: payload.limit,
      reverse: payload.reverse,
    });
    if (response.items.length) {
      feedStateActions.setFeedItems(response);
    }
  };

  const handleBackNavigation = () => {
    /* back navigation logic here */
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

  const handleEntryPublish = async (ethAddress: string, _content: any) => {
    const localId = `${ethAddress}-${pendingEntries.length + 1}`;
    try {
      const entry = {
        content: 'this is a test published content',
        author: {
          ethAddress,
        },
      };
      // await savePublished(ethAddress, pendingEntries);
      pendingActions.addEntry({
        entry,
        localId,
        ethAddress: 'asddsa',
        step: 'PUBLISH_START',
      });
      // feedStateActions.publishEntry(ethAddress, localId, entry);
    } catch (err) {
      props.logger.error('Error publishing entry');
    }
  };
  return (
    <Box fill="horizontal">
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
        customEntities={getFeedCustomEntities({
          t,
          locale,
          isMobile,
          handleBackNavigation,
          feedItems: feedState.feedItems,
          loggedEthAddress: '0x123123123123',
          handlePublish: handleEntryPublish,
          pendingEntries: pendingEntries,
          onAvatarClick: handleAvatarClick,
        })}
      />
    </Box>
  );
};

export default FeedPage;
