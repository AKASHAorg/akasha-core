import * as React from 'react';
import { RouteProps } from 'react-router';
import DS from '@akashaproject/design-system';
import { useBookmarksState } from '../../state/bookmarks-state';
import { useProfileState } from '../../state/profile-state';
import { IGetFeedOptions } from '../../state/feed-state';
import { useTranslation } from 'react-i18next';

const { Box, VirtualList, EntryCard, ErrorInfoCard, ErrorLoader, Button } = DS;

const noop = () => null;

export interface ISavedEntriesPageProps {
  sdkModules: any;
  logger: any;
  globalChannel: any;
  i18n?: any;
  singleSpa: any;
}

const SavedEntriesPage: React.FC<ISavedEntriesPageProps & RouteProps> = props => {
  const { sdkModules, logger, i18n } = props;
  const [bookmarkState, bookmarkStateActions] = useBookmarksState(sdkModules, logger);
  const [profileState] = useProfileState(sdkModules, logger);
  const { loggedEthAddress, fetching } = profileState.data;
  const { t } = useTranslation();
  const locale = i18n.languages[0] || 'en';

  const loadInitialFeed = (_payload: IGetFeedOptions['options']) => {
    if (!loggedEthAddress) {
      return;
    }
    bookmarkStateActions.getBookmarkedItems({
      ethAddress: loggedEthAddress,
      options: { limit: 100 ** 100 },
    });
  };

  const loadItemData = (payload: { itemId: string }) => {
    const { itemId } = payload;
    bookmarkStateActions.getItemData({ entryId: itemId });
  };

  const handleAvatarClick = () => {
    props.singleSpa.navigateToUrl('/profile/0x00123123123');
  };
  // you can only unbookmark here
  const handleEntryBookmark = (entryId: string) => {
    if (profileState.data.loggedEthAddress) {
      return bookmarkStateActions.unbookmarkEntry({
        entryId,
        ethAddress: profileState.data.loggedEthAddress,
      });
    }
  };

  const handleEntryRepost = (_withComment: boolean, _entryId?: string) => {
    // not implemented
  };

  const handleEntryShare = (_service: string, _entryId?: string) => {
    // not implemented
  };

  const handleEntryFlag = (_entryId?: string) => {
    // not implemented
  };

  const handleLinkCopy = (_link: string) => {
    // not implemented
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

  const handleLogin = () => {
    return;
  };

  return (
    <Box fill={true}>
      {!loggedEthAddress && !fetching && (
        <>
          <ErrorLoader
            type="no-login"
            title="No Ethereum address detected"
            details="You need to login or allow access to your current Ethereum address in your Web3 Ethereum client like MetaMask, and then reload, please."
          >
            <Button label="Connect Wallet" primary={true} onClick={handleLogin} />
          </ErrorLoader>
        </>
      )}
      {loggedEthAddress && !fetching && bookmarkState.data.bookmarkedIds.size === 0 && (
        <ErrorLoader
          type="missing-saved-items"
          title="Save your inspiration"
          details="You have not yet added any post to your saved items. Once you add them, they will be displayed here."
        />
      )}
      {loggedEthAddress && fetching && <Box>Loading Saved entries, please wait!</Box>}
      <ErrorInfoCard errors={bookmarkState.data.errors}>
        {(messages, isCritical) => (
          <>
            {messages && (
              <ErrorLoader
                type="script-error"
                title={t('There was an error loading the list')}
                details={messages}
              />
            )}
            {!isCritical && (
              <VirtualList
                items={Array.from(bookmarkState.data.bookmarkedIds as Set<string>)}
                itemsData={bookmarkState.data.entriesData}
                loadItemData={loadItemData}
                loadMore={noop}
                loadInitialFeed={loadInitialFeed}
                hasMoreItems={false}
                getItemCard={({ itemData }) => {
                  return (
                    <EntryCard
                      isBookmarked={true}
                      entryData={itemData}
                      onClickAvatar={handleAvatarClick}
                      onEntryBookmark={handleEntryBookmark}
                      repliesLabel={t('Replies')}
                      repostsLabel={t('Reposts')}
                      repostLabel={t('Repost')}
                      repostWithCommentLabel={t('Repost with comment')}
                      shareLabel={t('Share')}
                      copyIPFSLinkLabel={t('Copy IPFS Link')}
                      flagAsLabel={t('Flag as inappropiate')}
                      copyLinkLabel={t('Copy Link')}
                      loggedProfileEthAddress={loggedEthAddress}
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
                  );
                }}
              />
            )}
          </>
        )}
      </ErrorInfoCard>
    </Box>
  );
};

export default SavedEntriesPage;
