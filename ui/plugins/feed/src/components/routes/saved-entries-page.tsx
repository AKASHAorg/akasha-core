import * as React from 'react';
import { RouteProps } from 'react-router';
import DS from '@akashaproject/design-system';
import { useBookmarksState } from '../../state/bookmarks-state';
import { useProfileState } from '../../state/profile-state';

const { Box, VirtualList } = DS;

export interface ISavedEntriesPageProps {
  sdkModules: any;
  logger: any;
}

const SavedEntriesPage: React.FC<ISavedEntriesPageProps & RouteProps> = props => {
  const { sdkModules, logger } = props;
  const [bookmarkState, bookmarkStateActions] = useBookmarksState(sdkModules, logger);
  const [profileState, profileStateActions] = useProfileState(sdkModules, logger);

  React.useEffect(() => {
    profileStateActions.getLoggedEthAddress();
  }, []);
  React.useEffect(() => {
    if (profileState.data.loggedEthAddress) {
      bookmarkStateActions.getBookmarkedItems({
        ethAddress: profileState.data.loggedEthAddress,
        options: { limit: Infinity },
      });
    }
  }, [profileState.data.loggedEthAddress]);
  return (
    <Box fill={true}>
      {!profileState.data.loggedEthAddress && !profileState.data.fetching && (
        <Box>You must login to view your saved entries!</Box>
      )}
      <VirtualList
        items={Array.from(bookmarkState.data.bookmarkedIds as Set<string>)}
        itemsData={bookmarkState.data.entriesData}
        loadItemData={() => {}}
        loadMore={() => {}}
        loadInitialFeed={() => {}}
        hasMoreItems={true}
        getItemCard={({ itemData, itemId }) => {
          return <div key={itemId}>ItemCard of {itemData.entryId}</div>;
        }}
      />
    </Box>
  );
};

export default SavedEntriesPage;
