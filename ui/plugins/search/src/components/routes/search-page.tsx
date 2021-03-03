import * as React from 'react';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { useParams } from 'react-router-dom';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { useBookmarks, useFollow, useSearch, useTagSubscribe } from '@akashaproject/ui-awf-hooks';
import { UseLoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';

const { Box, Icon, BasicCardBox, ErrorLoader, Spinner, DuplexButton, EntryCard, ProfileCard } = DS;

interface SearchPageProps {
  onError?: (err: Error) => void;
  sdkModules: any;
  logger: any;
  globalChannel: any;
  singleSpa: any;
  loginState: UseLoginState;
  showLoginModal: () => void;
}

const SearchPage: React.FC<SearchPageProps> = props => {
  const { sdkModules, logger, singleSpa, globalChannel, loginState, showLoginModal } = props;

  const { searchKeyword } = useParams<{ searchKeyword: string }>();

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [bookmarkState, bookmarkActions] = useBookmarks({
    onError: (err: IAkashaError) => {
      logger.error('useBookmark error %j', err);
    },
    dbService: sdkModules.db,
  });

  const [searchState, searchActions] = useSearch({
    onError: (err: IAkashaError) => {
      logger.error('useSearch error %j', err);
    },
    logger: logger,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
    postsService: sdkModules.posts,
  });

  const [followedProfiles, followActions] = useFollow({
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo.error.message, errorInfo.errorKey);
    },
  });

  const [tagSubscriptionState, tagSubscriptionActions] = useTagSubscribe({
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo.error.message, errorInfo.errorKey);
    },
  });

  React.useEffect(() => {
    searchActions.search(searchKeyword);
  }, [searchKeyword]);

  React.useEffect(() => {
    if (loginState.currentUserCalled && loginState.ethAddress) {
      bookmarkActions.getBookmarks();
    }
  }, [loginState.currentUserCalled, loginState.ethAddress]);

  React.useEffect(() => {
    if (loginState.ethAddress) {
      searchState.profiles.slice(0, 4).forEach(async (profile: any) => {
        if (loginState.ethAddress && profile.ethAddress) {
          followActions.isFollowing(loginState.ethAddress, profile.ethAddress);
        }
      });
      tagSubscriptionActions.getTagSubscriptions();
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
    singleSpa.navigateToUrl(`/AKASHA-app/post/${entryId}`);
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

  const emptySearchState =
    searchState.profiles.length === 0 &&
    searchState.entries.length === 0 &&
    searchState.comments.length === 0 &&
    searchState.tags.length === 0;

  return (
    <Box fill="horizontal">
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
            title={t('No matching results found 😞')}
            details={t(
              'Make sure you spelled everything correctly or try searching for something else',
            )}
          />
        </BasicCardBox>
      )}

      {!searchState.isFetching && !emptySearchState && (
        <Box>
          <Box align="start" pad={{ bottom: 'medium' }} gap="small" direction="row">
            {searchState.tags.map((tag: any, index: number) => (
              <Box key={index}>
                <DuplexButton
                  activeHoverLabel={`#${tag}`}
                  active={tagSubscriptionState.includes(tag)}
                  activeLabel={`#${tag}`}
                  inactiveLabel={`#${tag}`}
                  onClickActive={() => handleTagUnsubscribe(tag)}
                  onClickInactive={() => handleTagSubscribe(tag)}
                  icon={<Icon type="subscribe" />}
                />
              </Box>
            ))}
          </Box>

          {searchState.profiles.slice(0, 4).map((profileData: any, index: number) => (
            <Box
              key={index}
              onClick={() => handleProfileClick(profileData.pubKey)}
              pad={{ bottom: 'medium' }}
            >
              <ProfileCard
                onENSChangeClick={() => null}
                onUpdateClick={() => null}
                onClickFollowers={() => null}
                onClickFollowing={() => null}
                onClickPosts={() => null}
                handleFollow={() => handleFollowProfile(profileData.ethAddress)}
                handleUnfollow={() => handleUnfollowProfile(profileData.ethAddress)}
                handleShareClick={() => null}
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
                flaggable={true}
                flagAsLabel={t('Report Profile')}
                onEntryFlag={() => null}
              />
            </Box>
          ))}
          {searchState.entries.slice(0, 4).map((entryData: any, index: number) => (
            <Box
              key={index}
              onClick={() => handlePostClick(entryData.entryId)}
              pad={{ bottom: 'medium' }}
            >
              <EntryCard
                isBookmarked={
                  bookmarkState.bookmarks.findIndex(bm => bm.entryId === entryData.entryId) >= 0
                }
                entryData={entryData}
                sharePostLabel={t('Share Post')}
                shareTextLabel={t('Share this post with your friends')}
                sharePostUrl={`${window.location.origin}/AKASHA-app/post/`}
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
                onRepost={() => null}
                onEntryFlag={() => null}
                handleFollowAuthor={() => handleFollowProfile(entryData.author.ethAddress)}
                handleUnfollowAuthor={() => handleUnfollowProfile(entryData.author.ethAddress)}
                isFollowingAuthor={followedProfiles.includes(entryData.author)}
                onContentClick={() => handlePostClick(entryData.entryId)}
                onMentionClick={() => handleProfileClick(entryData.author.pubKey)}
                contentClickable={true}
              />
            </Box>
          ))}
          {searchState.comments.slice(0, 4).map((commentData: any, index: number) => (
            <Box
              key={index}
              onClick={() => handlePostClick(commentData.postId)}
              pad={{ bottom: 'medium' }}
            >
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
                flagAsLabel={t('Report Post')}
                loggedProfileEthAddress={loginState.ethAddress}
                locale={locale || 'en'}
                style={{ height: 'auto' }}
                bookmarkLabel={t('Save')}
                bookmarkedLabel={t('Saved')}
                onRepost={() => null}
                onEntryFlag={() => null}
                handleFollowAuthor={() => handleFollowProfile(commentData.author.ethAddress)}
                handleUnfollowAuthor={() => handleUnfollowProfile(commentData.author.ethAddress)}
                isFollowingAuthor={followedProfiles.includes(commentData.author)}
                onContentClick={() => handlePostClick(commentData.postId)}
                onMentionClick={() => handleProfileClick(commentData.author.pubKey)}
                contentClickable={true}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchPage;
