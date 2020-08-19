import DS from '@akashaproject/design-system';
import * as React from 'react';
import { match, RouteComponentProps } from 'react-router-dom';
import { useFeedState, IGetFeedOptions /* FeedState */ } from '../../state/feed-state';
import { ILoadItemDataPayload } from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { useTranslation } from 'react-i18next';
import { useBookmarksState } from '../../state/bookmarks-state';
import { useProfileState } from '../../state/profile-state';

const {
  Box,
  VirtualList,
  EditorCard,
  EntryCard,
  styled,
  ErrorInfoCard,
  EntryCardLoading,
  MainAreaCardBox,
  ErrorLoader,
} = DS;

export interface IFeedHomePageProps {
  match: match<any> | null;
  singleSpa: any;
  i18n?: any;
  sdkModules: any;
  logger: any;
  isMobile: boolean;
}
const NewEntriesPopover = styled.div`
  position: sticky;
  z-index: 10;
  background: #89c9ff;
  padding: 1em;
  box-shadow: 0px 1px 4px 0px #ddd;
  border-radius: 9px;
  cursor: pointer;
  max-width: max-content;
`;

const FeedHomePage: React.FC<IFeedHomePageProps & RouteComponentProps> = props => {
  const { i18n, sdkModules, logger, isMobile } = props;
  const [feedState, feedStateActions] = useFeedState(sdkModules, logger);
  const [bookmarkState, bookmarkActions] = useBookmarksState(sdkModules, logger);
  const [profileState] = useProfileState(sdkModules, logger);

  const { t } = useTranslation();
  const locale = i18n.languages[0] || 'en';
  const vlInstance = React.createRef<any>();
  React.useEffect(() => {
    if (profileState.data.loggedEthAddress) {
      bookmarkActions.getBookmarkedItems({
        ethAddress: profileState.data.loggedEthAddress,
        options: { limit: Infinity },
      });
    }
  }, [profileState.data.loggedEthAddress]);

  const loadInitialFeed = (payload: IGetFeedOptions['options']) => {
    feedStateActions.getFeedItems({ options: payload, filters: feedState.data.filters });
    feedStateActions.checkForNewEntries({ startId: payload.start });
  };

  const loadMore = (payload: IGetFeedOptions['options']) => {
    if (feedState.data.fetching) {
      return;
    }
    feedStateActions.getFeedItems({ options: payload, filters: feedState.data.filters });
  };

  const loadItemData = (payload: ILoadItemDataPayload) => {
    const { itemId } = payload;
    feedStateActions.getItemData({ entryId: itemId });
  };

  const handleAvatarClick = () => {
    props.singleSpa.navigateToUrl('/profile/0x00123123123');
  };

  // const handleFiltersChange = (payload: {
  //   filter?: FeedState['filters']['filter'];
  //   sort?: FeedState['filters']['sort'];
  // }) => () => {
  //   feedStateActions.resetFeed();
  //   feedStateActions.changeActiveFilters({ ...feedState.data.filters, ...payload });
  //   feedStateActions.getFeedItems({
  //     options: { limit: 5, reverse: false },
  //     filters: { ...feedState.data.filters, ...payload },
  //   });
  // };

  const handleEntryBookmark = (entryId: string, isBookmarked: boolean | null) => {
    if (profileState.data.loggedEthAddress) {
      if (isBookmarked) {
        return bookmarkActions.unbookmarkEntry({
          entryId,
          ethAddress: profileState.data.loggedEthAddress,
        });
      }
      bookmarkActions.bookmarkEntry({ entryId, ethAddress: profileState.data.loggedEthAddress });
    }
  };

  const handleEntryRepost = (withComment: boolean, entryId?: string) => {
    logger.info(
      'reposting is not implemented. entryId => %s, postWithComment => %j',
      entryId,
      withComment,
    );
  };
  // https://ethereum.world/app/:appName/post/:postId
  // -> explore apps => https://ethereum.world/apps/:appName
  // -> comments => https://ethereum.world/app/:appName/post/:commentId
  const handleEntryShare = (service: string, entryId?: string) => {
    logger.info('share entry %s on %s', entryId, service);
  };

  const handleEntryFlag = (entryId?: string) => {
    logger.info('flag entry: %s', entryId);
  };

  const handleLinkCopy = (link: string) => {
    logger.info('copy link: %s', link);
  };

  const handleClickReplies = () => {
    // this should redirect to the full entry view?
    return;
  };

  const handleFollow = () => {
    // to be implemented when we have this functionality
    return;
  };

  const handleUnfollow = () => {
    // to be implemented when we have this functionality
    return;
  };

  const handleNewerEntriesLoad = () => {
    feedStateActions.loadNewerEntries({ newerEntries: feedState.data.feedViewState.newerEntries });
    vlInstance.current.scrollTo({
      top: 0,
    });
  };

  const handleItemRead = (itemId: string) => {
    if (profileState.data.loggedEthAddress) {
      feedStateActions.markAsRead({ itemId, ethAddress: profileState.data.loggedEthAddress });
    }
  };

  return (
    <Box flex={{ grow: 1 }} fill="horizontal" align="center">
      <ErrorInfoCard errors={feedState.data.errors}>
        {(messages, isCritical) => (
          <>
            {messages && (
              <ErrorLoader
                type="script-error"
                title={t('There was an error loading the feed')}
                details={messages}
              />
            )}
            {!isCritical && (
              <VirtualList
                ref={vlInstance}
                items={feedState.data.entryIds}
                itemsData={feedState.data.entriesData}
                loadInitialFeed={loadInitialFeed}
                loadMore={loadMore}
                loadItemData={loadItemData}
                bookmarkedItems={bookmarkState.data.bookmarkedIds as Set<string>}
                getNewItemsNotification={({ styles }) => (
                  <NewEntriesPopover onClick={handleNewerEntriesLoad} style={styles}>
                    <b>{feedState.data.feedViewState.newerEntries.length}</b> {t('new entries')}
                  </NewEntriesPopover>
                )}
                hasMoreItems={true}
                onItemRead={handleItemRead}
                initialState={feedState.data.feedViewState}
                getItemCard={({ itemData, isBookmarked }) => {
                  return (
                    <ErrorInfoCard errors={itemData.status.errors}>
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
                              {!itemData.author?.ethAddress && (
                                <MainAreaCardBox>
                                  <EntryCardLoading />
                                </MainAreaCardBox>
                              )}
                              {itemData.author?.ethAddress && (
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
                                  loggedProfileEthAddress={profileState.data.loggedEthAddress}
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
                  );
                }}
                customEntities={
                  !isMobile
                    ? [
                        {
                          position: 'before',
                          // itemIndex: 0,
                          itemId: feedState.data.entryIds.length
                            ? feedState.data.entryIds[0]
                            : null,
                          getComponent: ({ key, style }: { key: string; style: any }) => (
                            <EditorCard
                              ethAddress={profileState.data.loggedEthAddress}
                              publishLabel="Publish"
                              placeholderLabel="Write something"
                              onPublish={() => null}
                              style={style}
                              key={key}
                            />
                          ),
                        },
                      ]
                    : undefined
                }
              />
            )}
          </>
        )}
      </ErrorInfoCard>
    </Box>
  );
};

export default FeedHomePage;
