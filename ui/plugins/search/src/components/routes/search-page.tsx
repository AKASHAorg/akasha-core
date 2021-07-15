import * as React from 'react';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { useParams } from 'react-router-dom';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import {
  useBookmarks,
  useFollow,
  useSearch,
  useTagSubscribe,
  useErrors,
} from '@akashaproject/ui-awf-hooks';
import { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import { ModalState, ModalStateActions } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';

const {
  Box,
  BasicCardBox,
  ErrorLoader,
  Spinner,
  EntryCard,
  EntryCardHidden,
  ProfileSearchCard,
  TagSearchCard,
  SwitchCard,
} = DS;

interface SearchPageProps extends RootComponentProps {
  onError?: (err: Error) => void;
  loginState: ILoginState;
  showLoginModal: () => void;
  modalState: ModalState;
  modalStateActions: ModalStateActions;
}

const SearchPage: React.FC<SearchPageProps> = props => {
  const { logger, singleSpa, loginState, showLoginModal } = props;

  const { searchKeyword } = useParams<{ searchKeyword: string }>();

  const { t, i18n } = useTranslation();

  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [, errorActions] = useErrors({ logger });

  const [bookmarkState, bookmarkActions] = useBookmarks({
    onError: (err: IAkashaError) => {
      logger.error('useBookmark error %j', err);
    },
  });

  const [searchState, searchActions] = useSearch({
    user: loginState.ethAddress,
    logger: logger,
    onError: errorActions.createError,
  });

  const [followedProfiles, followActions] = useFollow({
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo.error.message, errorInfo.errorKey);
    },
  });

  const [tagSubscriptionState, tagSubscriptionActions] = useTagSubscribe({
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    if (loginState.currentUserCalled) {
      searchActions.search(decodeURIComponent(searchKeyword));
    }
  }, [searchKeyword, loginState.currentUserCalled, loginState.ethAddress]);

  React.useEffect(() => {
    if (loginState.waitForAuth && !loginState.ready) {
      return;
    }
    if (
      (loginState.waitForAuth && loginState.ready) ||
      (loginState.currentUserCalled && loginState.ethAddress)
    ) {
      bookmarkActions.getBookmarks();
      tagSubscriptionActions.getTagSubscriptions();
    }
  }, [JSON.stringify(loginState)]);

  React.useEffect(() => {
    if (loginState.ethAddress) {
      searchState.profiles.slice(0, 4).forEach(async (profile: any) => {
        if (loginState.ethAddress && profile.ethAddress) {
          followActions.isFollowing(loginState.ethAddress, profile.ethAddress);
        }
      });
    }
  }, [searchState, loginState.ethAddress]);

  const handleTagSubscribe = (tagName: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    tagSubscriptionActions.toggleTagSubscription(tagName);
  };
  const handleTagUnsubscribe = (tagName: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    tagSubscriptionActions.toggleTagSubscription(tagName);
  };

  const handleProfileClick = (pubKey: string) => {
    singleSpa.navigateToUrl(`/profile/${pubKey}`);
  };
  const handleFollowProfile = (ethAddress: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    followActions.follow(ethAddress);
  };

  const handleUnfollowProfile = (ethAddress: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    followActions.unfollow(ethAddress);
  };

  const handlePostClick = (entryId: string) => {
    singleSpa.navigateToUrl(`/social-app/post/${entryId}`);
  };

  const handleTagClick = (name: string) => {
    props.singleSpa.navigateToUrl(`/social-app/tags/${name}`);
  };

  const handleEntryBookmark = (entryId: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    if (bookmarkState.bookmarks.findIndex(bm => bm.entryId === entryId) >= 0) {
      return bookmarkActions.removeBookmark(entryId);
    }
    return bookmarkActions.bookmarkPost(entryId);
  };

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    props.navigateToModal({ name: 'report-modal', entryId, contentType });
  };

  // repost related
  const handleRepost = (_withComment: boolean, entryData: any) => {
    props.navigateToModal({ name: 'editor', embedEntry: entryData });
  };

  const handleFlipCard = (entry: any, isQuote: boolean) => () => {
    // modify the entry
    const modifiedEntry = isQuote
      ? { ...entry, quote: { ...entry.quote, reported: false } }
      : { ...entry, reported: false };
    // update state
    searchActions.updateSearchState(modifiedEntry);
  };

  const emptySearchState =
    searchState.profiles.length === 0 &&
    searchState.entries.length === 0 &&
    searchState.comments.length === 0 &&
    searchState.tags.length === 0;

  const [activeButton, setActiveButton] = React.useState<string>('All');
  const buttonValues = ['All', 'People', 'Topics', 'Posts', 'Replies'];
  const buttonLabels = [t('All'), t('People'), t('Topics'), t('Posts'), t('Replies')];

  const onTabClick = (value: string) => {
    setActiveButton(buttonValues[buttonLabels.indexOf(value)]);
  };

  const onNavBack = () => {
    history.back();
  };

  const searchCount =
    searchState.profiles?.length +
    searchState.entries?.length +
    searchState.tags?.length +
    searchState.comments?.length;

  return (
    <Box fill="horizontal">
      <SwitchCard
        count={searchCount}
        countLabel={t('Results')}
        activeButton={activeButton}
        onTabClick={onTabClick}
        onIconClick={onNavBack}
        hasIcon={true}
        hasMobileDesign={true}
        buttonLabels={buttonLabels}
        buttonValues={buttonValues}
        loggedEthAddress={loginState.ethAddress}
      />

      {searchState.isFetching && (
        <BasicCardBox>
          <Box pad="large">
            <Spinner />
          </Box>
        </BasicCardBox>
      )}
      {!searchState.isFetching && emptySearchState && (
        <BasicCardBox>
          <ErrorLoader
            type="no-login"
            title={`${t('No matching results found')} 😞`}
            details={t(
              'Make sure you spelled everything correctly or try searching for something else',
            )}
          />
        </BasicCardBox>
      )}

      {!searchState.isFetching && !emptySearchState && (
        <Box>
          {(activeButton === buttonValues[0] || activeButton === buttonValues[1]) &&
            searchState.profiles.slice(0, 4).map((profileData: any, index: number) => (
              <Box key={index} pad={{ bottom: 'medium' }}>
                <ProfileSearchCard
                  handleFollow={() => handleFollowProfile(profileData.ethAddress)}
                  handleUnfollow={() => handleUnfollowProfile(profileData.ethAddress)}
                  isFollowing={followedProfiles.includes(profileData?.ethAddress)}
                  loggedEthAddress={loginState.ethAddress}
                  profileData={profileData}
                  followLabel={t('Follow')}
                  unfollowLabel={t('Unfollow')}
                  descriptionLabel={t('About me')}
                  followingLabel={t('Following')}
                  followersLabel={t('Followers')}
                  postsLabel={t('Posts')}
                  shareProfileLabel={t('Share')}
                  profileAnchorLink={'/profile'}
                  onClickProfile={() => handleProfileClick(profileData.pubKey)}
                />
              </Box>
            ))}

          {(activeButton === buttonValues[0] || activeButton === buttonValues[2]) &&
            searchState.tags.map((tag: any, index: number) => (
              <Box key={index} pad={{ bottom: 'medium' }}>
                <TagSearchCard
                  tag={tag}
                  subscribedTags={tagSubscriptionState}
                  subscribeLabel={t('Subscribe')}
                  unsubscribeLabel={t('Unsubscribe')}
                  tagAnchorLink={'/social-app/tags'}
                  onClickTag={() => handleTagClick(tag.name)}
                  handleSubscribeTag={handleTagSubscribe}
                  handleUnsubscribeTag={handleTagUnsubscribe}
                />
              </Box>
            ))}
          {(activeButton === buttonValues[0] || activeButton === buttonValues[3]) &&
            searchState.entries.slice(0, 4).map((entryData: any, index: number) => (
              <Box key={index} pad={{ bottom: 'medium' }}>
                {entryData.delisted ? (
                  <EntryCardHidden
                    moderatedContentLabel={t('This content has been moderated')}
                    isDelisted={true}
                  />
                ) : entryData.reported ? (
                  <EntryCardHidden
                    awaitingModerationLabel={t(
                      'You have reported this content. It is awaiting moderation.',
                    )}
                    ctaLabel={t('See it anyway')}
                    handleFlipCard={handleFlipCard && handleFlipCard(entryData, false)}
                  />
                ) : (
                  <EntryCard
                    isBookmarked={
                      bookmarkState.bookmarks.findIndex(bm => bm.entryId === entryData.entryId) >= 0
                    }
                    entryData={entryData}
                    sharePostLabel={t('Share Post')}
                    shareTextLabel={t('Share this post with your friends')}
                    sharePostUrl={`${window.location.origin}/social-app/post/`}
                    onClickAvatar={() => handleProfileClick(entryData.author.pubKey)}
                    onEntryBookmark={handleEntryBookmark}
                    repliesLabel={t('Replies')}
                    repostsLabel={t('Reposts')}
                    repostLabel={t('Repost')}
                    repostWithCommentLabel={t('Repost with comment')}
                    shareLabel={t('Share')}
                    copyLinkLabel={t('Copy Link')}
                    flagAsLabel={t('Report Post')}
                    loggedProfileEthAddress={loginState.ethAddress}
                    locale={locale || 'en'}
                    style={{ height: 'auto' }}
                    bookmarkLabel={t('Save')}
                    bookmarkedLabel={t('Saved')}
                    profileAnchorLink={'/profile'}
                    repliesAnchorLink={'/social-app/post'}
                    onRepost={handleRepost}
                    onEntryFlag={handleEntryFlag(entryData.entryId, 'post')}
                    handleFollowAuthor={() => handleFollowProfile(entryData.author.ethAddress)}
                    handleUnfollowAuthor={() => handleUnfollowProfile(entryData.author.ethAddress)}
                    isFollowingAuthor={followedProfiles.includes(entryData.author)}
                    onContentClick={() => handlePostClick(entryData.entryId)}
                    onMentionClick={handleProfileClick}
                    onTagClick={handleTagClick}
                    singleSpaNavigate={singleSpa.navigateToUrl}
                    contentClickable={true}
                    handleFlipCard={handleFlipCard}
                  />
                )}
              </Box>
            ))}
          {(activeButton === buttonValues[0] || activeButton === buttonValues[4]) &&
            searchState.comments.slice(0, 4).map((commentData: any, index: number) => (
              <Box key={index} pad={{ bottom: 'medium' }}>
                <EntryCard
                  isBookmarked={
                    bookmarkState.bookmarks.findIndex(bm => bm.entryId === commentData.entryId) >= 0
                  }
                  entryData={commentData}
                  sharePostLabel={t('Share Post')}
                  shareTextLabel={t('Share this post with your friends')}
                  sharePostUrl={'https://ethereum.world'}
                  onClickAvatar={() => handleProfileClick(commentData.author.pubKey)}
                  onEntryBookmark={handleEntryBookmark}
                  repliesLabel={t('Replies')}
                  repostsLabel={t('Reposts')}
                  repostLabel={t('Repost')}
                  repostWithCommentLabel={t('Repost with comment')}
                  shareLabel={t('Share')}
                  copyLinkLabel={t('Copy Link')}
                  flagAsLabel={t('Report Comment')}
                  loggedProfileEthAddress={loginState.ethAddress}
                  locale={locale || 'en'}
                  style={{ height: 'auto' }}
                  bookmarkLabel={t('Save')}
                  bookmarkedLabel={t('Saved')}
                  profileAnchorLink={'/profile'}
                  repliesAnchorLink={'/social-app/post'}
                  onRepost={() => null}
                  onEntryFlag={handleEntryFlag(commentData.entryId, 'reply')}
                  handleFollowAuthor={() => handleFollowProfile(commentData.author.ethAddress)}
                  handleUnfollowAuthor={() => handleUnfollowProfile(commentData.author.ethAddress)}
                  isFollowingAuthor={followedProfiles.includes(commentData.author)}
                  onContentClick={() => handlePostClick(commentData.postId)}
                  onMentionClick={handleProfileClick}
                  onTagClick={handleTagClick}
                  singleSpaNavigate={singleSpa.navigateToUrl}
                  contentClickable={true}
                  handleFlipCard={handleFlipCard}
                />
              </Box>
            ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchPage;
