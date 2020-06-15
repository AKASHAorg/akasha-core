import DS from '@akashaproject/design-system';
import * as React from 'react';
import { match, RouteComponentProps } from 'react-router-dom';
import { useFeedState, IGetFeedOptions /* FeedState */ } from '../../state/entry-state';
import { ILoadItemDataPayload } from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { useTranslation } from 'react-i18next';

const { Box, VirtualList, EditorCard, EntryCard /* MainAreaCardBox */ } = DS;

export interface IFeedHomePageProps {
  match: match<any> | null;
  singleSpa: any;
  i18n?: any;
  sdkModules: any;
  logger: any;
}

const FeedHomePage: React.FC<IFeedHomePageProps & RouteComponentProps> = props => {
  const { i18n, sdkModules, logger } = props;
  const [feedState, feedStateActions] = useFeedState(sdkModules, logger);
  const { t } = useTranslation();
  // const feedSourcesCount = 38;

  React.useEffect(() => {
    feedStateActions.getLoggedEthAddress();
  }, []);

  React.useEffect(() => {
    if (feedState.data.loggedEthAddress) {
      feedStateActions.getBookmarkedEntries({ ethAddress: feedState.data.loggedEthAddress });
    }
  }, [feedState.data.loggedEthAddress]);

  const locale = i18n.languages[0] || 'en';
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
    if (isSaved) {
      return feedStateActions.unbookmarkEntry({ entryId });
    }
    feedStateActions.bookmarkEntry({ entryId });
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
        bookmarkedItems={feedState.data.bookmarkedIds as Set<string>}
        // initialState={listState.initialState}
        getItemCard={({ itemData, isBookmarked }) => (
          <EntryCard
            isBookmarked={isBookmarked}
            entryData={itemData}
            onClickAvatar={handleAvatarClick}
            onEntryBookmark={handleEntryBookmark}
            repliesLabel={t('Replies', { count: itemData.repliesCount })}
            repostsLabel={t('Reposts', { count: itemData.repostsCount })}
            shareLabel={t('Share')}
            editPostLabel={t('Edit Post')}
            copyLinkLabel={t('Copy Link')}
            loggedProfileEthAddress="0x00123"
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
