import DS from '@akashaproject/design-system';
import * as React from 'react';
import { match, RouteComponentProps } from 'react-router-dom';
import { useFeedState, IGetFeedOptions /* FeedState */ } from '../../state/feed-state';
import { ILoadItemDataPayload } from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { useTranslation } from 'react-i18next';
import { useBookmarksState } from '../../state/bookmarks-state';
import { useProfileState } from '../../state/profile-state';
import { useInterval } from '../hooks/use-interval';

const { Box, VirtualList, EditorCard, EntryCard, styled /* MainAreaCardBox */ } = DS;

export interface IFeedHomePageProps {
  match: match<any> | null;
  singleSpa: any;
  i18n?: any;
  sdkModules: any;
  logger: any;
}
const NewEntriesPopover = styled.div`
  position: fixed;
  top: 3.5em;
  z-index: 10;
  background: #89c9ff;
  padding: 1em;
  box-shadow: 0px 1px 4px 0px #ddd;
  border-radius: 9px;
  left: 50%;
  transform: translate(-50%, 0);
  cursor: pointer;
`;

const FeedHomePage: React.FC<IFeedHomePageProps & RouteComponentProps> = props => {
  const { i18n, sdkModules, logger } = props;
  const [feedState, feedStateActions] = useFeedState(sdkModules, logger);
  const [bookmarkState, bookmarkActions] = useBookmarksState(sdkModules, logger);
  const [profileState] = useProfileState(sdkModules, logger);

  const { t } = useTranslation();
  // const feedSourcesCount = 38;
  // console.log(profileInfo, 'profile info in feed page');

  React.useEffect(() => {
    if (profileState.data.loggedEthAddress) {
      bookmarkActions.getBookmarkedItems({
        ethAddress: profileState.data.loggedEthAddress,
        options: { limit: Infinity },
      });
    }
  }, [profileState.data.loggedEthAddress]);

  const locale = i18n.languages[0] || 'en';
  useInterval(ticks => {
    if (ticks && ticks === 10) {
      feedStateActions.checkForNewEntries({ startId: feedState.data.feedViewState.startId });
    }
  }, 2000);
  const loadInitialFeed = (payload: IGetFeedOptions['options']) => {
    feedStateActions.getFeedItems({ options: payload, filters: feedState.data.filters });
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

  const handleEntryBookmark = (entryId: string, isSaved?: boolean) => {
    if (profileState.data.loggedEthAddress) {
      if (isSaved) {
        return bookmarkActions.unbookmarkEntry({
          entryId,
          ethAddress: profileState.data.loggedEthAddress,
        });
      }
      bookmarkActions.bookmarkEntry({ entryId, ethAddress: profileState.data.loggedEthAddress });
    }
  };

  const handleEntryRepost = (withComment: boolean, entryId?: string) => {
    console.log('repost entry', entryId, withComment ? 'with comment' : 'without comment');
  };

  const handleEntryShare = (service: string, entryId?: string) => {
    console.log('share entry on', service, 'entry:', entryId);
  };

  const handleEntryFlag = (entryId?: string) => {
    console.log('flag entry', entryId);
  };

  const handleLinkCopy = (link: string) => {
    console.log('link copy', link);
  };

  const handleNewerEntriesLoad = () => {
    console.log('load newer entries');
  };

  const handleItemRead = (itemId: string) => {
    console.log('item', itemId, 'was read');
  };

  return (
    <Box fill={true}>
      {/* <MainAreaCardBox style={{ margin: '0 1em' }}>
        <Box direction="row">
          <Box>Total of {feedSourcesCount} feed sources</Box>
          <Box direction="row">
            Currently Seeing: <span onClick={handleFiltersChange({ filter: 'all' })}>All</span> |{' '}
            <span onClick={handleFiltersChange({ filter: 'top_reposted' })}>Most Reposted</span>
          </Box>
          <Box direction="row">
            Sort by:
            <span onClick={handleFiltersChange({ sort: 'latest' })}>latest</span> |{' '}
            <span onClick={handleFiltersChange({ sort: 'oldest' })}>oldest</span>
          </Box>
        </Box>
      </MainAreaCardBox> */}
      <VirtualList
        items={feedState.data.entryIds}
        itemsData={feedState.data.entriesData}
        loadInitialFeed={loadInitialFeed}
        loadMore={loadMore}
        loadItemData={loadItemData}
        hasMoreItems={feedState.data.hasMoreItems}
        bookmarkedItems={bookmarkState.data.bookmarkedIds as Set<string>}
        getNewItemsNotification={() => (
          <NewEntriesPopover onClick={handleNewerEntriesLoad}>
            <b>{feedState.data.feedViewState.newerEntries.length}</b> {t('new entries')}
          </NewEntriesPopover>
        )}
        onItemRead={handleItemRead}
        initialState={feedState.data.feedViewState}
        getItemCard={({ itemData, isBookmarked }) => (
          <EntryCard
            isBookmarked={isBookmarked}
            entryData={itemData}
            onClickAvatar={handleAvatarClick}
            onEntryBookmark={handleEntryBookmark}
            repliesLabel={t('Replies', { count: itemData.repliesCount })}
            repostsLabel={t('Reposts', { count: itemData.repostsCount })}
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
          />
        )}
        customEntities={[
          {
            position: 'before',
            // itemIndex: 0,
            itemId: feedState.data.entryIds.length ? feedState.data.entryIds[0] : null,
            getComponent: ({ key, style }: { key: string; style: any }) => (
              <EditorCard
                ethAddress={'0x123'}
                publishLabel="Publish"
                placeholderLabel="Write something"
                onPublish={() => null}
                style={style}
                key={key}
              />
            ),
          },
        ]}
      />
    </Box>
  );
};

export default FeedHomePage;
