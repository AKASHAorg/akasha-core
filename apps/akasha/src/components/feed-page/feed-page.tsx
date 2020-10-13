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
import {
  addToIPFS,
  getPending,
  publishEntry,
  removePending,
  savePending,
  updatePending,
} from '../../services/posting-service';
import { getFeedCustomEntities } from './feed-page-custom-entities';
import useEntryPublisher from '../../hooks/use-entry-publisher';
import { IEntryData } from '@akashaproject/design-system/lib/components/Cards/entry-cards/entry-box';

const { Helmet, VirtualList, Box, ErrorInfoCard, ErrorLoader, EntryCardLoading, EntryCard } = DS;

export interface FeedPageProps {
  globalChannel: any;
  sdkModules: any;
  logger: any;
  showLoginModal: () => void;
  ethAddress: string | null;
  jwtToken: string | null;
  onError: (err: Error) => void;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const { isMobile, showLoginModal, ethAddress, jwtToken, onError } = props;
  const [feedState, feedStateActions] = useFeedReducer({});

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [pendingEntries, pendingActions] = useEntryPublisher({
    publishEntry: publishEntry,
    onPublishComplete: (ethAddr, publishedEntry) => {
      removePending(ethAddr, publishedEntry.localId);
      pendingActions.removeEntry(publishedEntry.localId);
      if (publishedEntry.entry.entryId) {
        // @TODO: this call (setFeedItemData) should be removed when we have real data
        // aka we should only `setFeedItems` and let the list to load fresh data from server/ipfs
        feedStateActions.setFeedItemData(publishedEntry.entry as IEntryData);
        feedStateActions.setFeedItems({
          reverse: true,
          items: [publishedEntry.entry as IEntryData],
        });
      }
    },
    ethAddress: ethAddress,
    addToIPFS: addToIPFS,
    getPendingEntries: getPending,
    onStep: (ethAddr, localId) => updatePending(ethAddr, localId).catch(err => onError(err)),
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

  const handleEntryPublish = async (authorEthAddr: string, _content: any) => {
    if (!ethAddress && !jwtToken) {
      showLoginModal();
      return;
    }
    const localId = `${authorEthAddr}-${pendingEntries.length + 1}`;
    try {
      const entry = {
        content: 'this is a test published content',
        author: {
          ethAddress: authorEthAddr,
        },
        time: new Date().getTime() / 1000,
      };
      pendingActions.addEntry({
        entry,
        localId,
        step: 'PUBLISH_START',
      });
      if (ethAddress) {
        await savePending(
          ethAddress,
          pendingEntries.concat([{ entry, localId, step: 'PUBLISH_START' }]),
        );
      }
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
          loggedEthAddress: ethAddress,
          handlePublish: handleEntryPublish,
          pendingEntries: pendingEntries,
          onAvatarClick: handleAvatarClick,
        })}
      />
    </Box>
  );
};

export default FeedPage;
