import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useFeedReducer, useEntryBookmark, useEntryPublisher } from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import {
  ILoadItemDataPayload,
  ILoadItemsPayload,
} from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { fetchFeedItemData } from '../../services/feed-service';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  addToIPFS,
  getPending,
  publishEntry,
  removePending,
  savePending,
  updatePending,
  serializeToSlate,
  getMediaUrl,
} from '../../services/posting-service';
import { getFeedCustomEntities } from './feed-page-custom-entities';
import { IEntryData } from '@akashaproject/design-system/lib/components/Cards/entry-cards/entry-box';
import { combineLatest } from 'rxjs';
import { redirectToPost } from '../../services/routing-service';

const { Helmet, VirtualList, Box, ErrorInfoCard, ErrorLoader, EntryCardLoading, EntryCard } = DS;

export interface FeedPageProps {
  globalChannel: any;
  sdkModules: any;
  navigateToUrl: (path: string) => void;
  logger: any;
  showLoginModal: () => void;
  ethAddress: string | null;
  jwtToken: string | null;
  onError: (err: Error) => void;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const { isMobile, showLoginModal, ethAddress, jwtToken, onError } = props;
  const [feedState, feedStateActions] = useFeedReducer({});
  const [isLoading, setIsLoading] = React.useState(false);

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

  const [bookmarks, bookmarkActions] = useEntryBookmark({
    ethAddress,
    onError,
    sdkModules: props.sdkModules,
    logger: props.logger,
  });

  const handleLoadMore = async (payload: ILoadItemsPayload) => {
    const req: { results: number; offset?: string } = {
      results: payload.limit,
    };
    if (!isLoading) {
      setIsLoading(true);
      fetchEntries(req);
    }
  };

  const loadItemData = async (payload: ILoadItemDataPayload) => {
    const resp = await fetchFeedItemData({ entryId: payload.itemId });
    if (resp) {
      feedStateActions.setFeedItemData(resp);
    }
  };
  const fetchEntries = async (payload: { results: number; offset?: string }) => {
    const profileService = props.sdkModules.profiles.profileService;
    const getPostsCall = profileService.getPosts({
      ...payload,
      offset: payload.offset || feedState.lastItemId,
    });
    const ipfsGatewayCall = props.sdkModules.commons.ipfsService.getSettings({});
    const call = combineLatest([ipfsGatewayCall, getPostsCall]);
    call.subscribe((resp: any) => {
      const ipfsGateway = resp[0].data;
      const { data }: { channelInfo: any; data: { last: string; result: any[] } } = resp[1];
      const { last, result } = data;
      const entryIds: { entryId: string }[] = [];
      result.forEach(entry => {
        entryIds.push({ entryId: entry.post.id });
        const mappedEntry = {
          author: {
            CID: entry.author.CID,
            description: entry.author.about,
            avatar: getMediaUrl(ipfsGateway, entry.author.avatar),
            coverImage: getMediaUrl(
              ipfsGateway,
              entry.author.backgroundImage?.hash,
              entry.author.backgroundImage?.data,
            ),
            ensName: entry.author.username,
            userName:
              entry.author?.data &&
              `${entry.author?.data?.firstName} ${entry.author?.data?.lastName}`,
            ethAddress: entry.author.address,
            postsNumber: entry.author.entries && Object.keys(entry.author.entries).length, // @todo: fix this with another api call
          },
          CID: entry.post.CID,
          content: serializeToSlate(entry.post, ipfsGateway),
          entryId: entry.post.id,
          time: new Date().toLocaleString(),
          ipfsLink: entry.id,
          permalink: 'null',
        };
        // console.table([mappedEntry, entry]);
        feedStateActions.setFeedItemData(mappedEntry);
      });
      feedStateActions.setFeedItems({ items: entryIds, lastItemId: last });
      setIsLoading(false);
    });
  };

  const onInitialLoad = async (payload: ILoadItemsPayload) => {
    const req: { results: number; offset?: string } = {
      results: payload.limit,
    };
    setIsLoading(true);
    fetchEntries(req);
  };

  const handleBackNavigation = () => {
    /* back navigation logic here */
  };

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => {
    props.singleSpa.navigateToUrl(`/profile/${authorEth}`);
    ev.preventDefault();
  };
  const handleEntryBookmark = (entryId: string) => {
    if (!ethAddress) {
      return showLoginModal();
    }
    bookmarkActions.addBookmark(entryId);
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
  const handleGetMentions = () => {
    /* todo */
  };
  const handleGetTags = () => {
    /* todo */
  };

  const handleNavigateToPost = redirectToPost(props.navigateToUrl);

  const handleEntryPublish = async (authorEthAddr: string, content: any) => {
    if (!ethAddress && !jwtToken) {
      showLoginModal();
      return;
    }
    const localId = `${authorEthAddr}-${pendingEntries.length + 1}`;
    try {
      const entry = {
        content: content,
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
        bookmarkedItems={bookmarks}
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
                        onClickAvatar={ev => handleAvatarClick(ev, itemData.author.ethAddress)}
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
                        onContentClick={handleNavigateToPost}
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
          handleGetMentions: handleGetMentions,
          handleGetTags: handleGetTags,
          ipfsService: props.sdkModules.commons.ipfsService,
          onContentClick: handleNavigateToPost,
        })}
      />
    </Box>
  );
};

export default FeedPage;
