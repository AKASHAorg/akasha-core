import * as React from 'react';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { useParams } from 'react-router-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { IProfileData } from '@akashaproject/ui-awf-typings/src/profile';
import { IEntryData, ITag } from '@akashaproject/ui-awf-typings/src/entry';
import { useTranslation } from 'react-i18next';
import {
  useGetBookmarks,
  useSaveBookmark,
  useDeleteBookmark,
} from '@akashaproject/ui-awf-hooks/lib/use-bookmarks.new';
import {
  useTagSubscriptions,
  useToggleTagSubscription,
} from '@akashaproject/ui-awf-hooks/lib/use-tag.new';
import {
  useIsFollowingMultiple,
  useFollow,
  useUnfollow,
} from '@akashaproject/ui-awf-hooks/lib/use-follow.new';
import { useSearch } from '@akashaproject/ui-awf-hooks/lib/use-search.new';
import { LoginState } from '@akashaproject/ui-awf-hooks/lib/use-login.new';
import { ItemTypes, ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';

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

export enum ButtonValues {
  ALL = 'All',
  PEOPLE = 'People',
  TOPICS = 'Topics',
  POSTS = 'Posts',
  REPLIES = 'Replies',
}

interface SearchPageProps extends RootComponentProps {
  onError?: (err: Error) => void;
  loginState: LoginState;
  showLoginModal: (redirectTo?: ModalNavigationOptions) => void;
}

const SearchPage: React.FC<SearchPageProps> = props => {
  const { singleSpa, loginState, showLoginModal } = props;

  const [reportedItems, setReportedItems] = React.useState<string[]>([]);

  const { searchKeyword } = useParams<{ searchKeyword: string }>();

  const { t, i18n } = useTranslation();

  const locale = (i18n.languages[0] || 'en') as ILocale;

  const bookmarksReq = useGetBookmarks(loginState?.isReady && loginState?.ethAddress);
  const bookmarks = bookmarksReq.data;
  const addBookmark = useSaveBookmark();
  const deleteBookmark = useDeleteBookmark();

  const tagSubscriptionsReq = useTagSubscriptions(loginState?.isReady && loginState?.ethAddress);
  const tagSubscriptionsState = tagSubscriptionsReq.data;

  const toggleTagSubscriptionReq = useToggleTagSubscription();

  const searchReq = useSearch(
    decodeURIComponent(searchKeyword),
    loginState?.pubKey,
    loginState?.fromCache,
  );
  const searchState = searchReq.data;

  const followEthAddressArr = searchState?.profiles?.slice(0, 4).map(profile => profile.ethAddress);
  const isFollowingMultipleReq = useIsFollowingMultiple(
    loginState?.ethAddress,
    followEthAddressArr,
  );
  const followedProfiles = isFollowingMultipleReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  React.useEffect(() => {
    // this effect sets reported items to state
    if (searchReq.status === 'success') {
      searchState.entries.map(entry => {
        if (entry.reported) {
          setReportedItems(prev => [...prev, entry.entryId]);
        }
      });

      searchState.comments.map(comment => {
        if (comment.reported) {
          setReportedItems(prev => [...prev, comment.entryId]);
        }
      });
    }
  }, [searchReq.status, searchState]);

  const handleTagSubscribe = (tagName: string) => {
    if (!loginState?.ethAddress) {
      showLoginModal();
      return;
    }
    toggleTagSubscriptionReq.mutate(tagName);
  };

  const handleProfileClick = (pubKey: string) => {
    singleSpa.navigateToUrl(`/profile/${pubKey}`);
  };
  const handleFollowProfile = (ethAddress: string) => {
    if (!loginState?.ethAddress) {
      showLoginModal();
      return;
    }
    followReq.mutate(ethAddress);
  };

  const handleUnfollowProfile = (ethAddress: string) => {
    if (!loginState?.ethAddress) {
      showLoginModal();
      return;
    }
    unfollowReq.mutate(ethAddress);
  };

  const handlePostClick = (entryId: string) => {
    singleSpa.navigateToUrl(`/social-app/post/${entryId}`);
  };

  const handleTagClick = (name: string) => {
    props.singleSpa.navigateToUrl(`/social-app/tags/${name}`);
  };

  const handleEntryBookmark = (itemType: ItemTypes) => (entryId: string) => {
    if (!loginState?.ethAddress) {
      showLoginModal();
      return;
    }
    if (bookmarks?.findIndex(bm => bm.entryId === entryId) >= 0) {
      return deleteBookmark.mutate(entryId);
    }
    return addBookmark.mutate({ entryId, itemType });
  };

  const handleEntryFlag = (entryId: string, itemType: string) => () => {
    if (!loginState?.pubKey) {
      return showLoginModal({ name: 'report-modal', entryId, itemType });
    }
    props.navigateToModal({ name: 'report-modal', entryId, itemType });
  };

  // repost related
  const handleRepost = (_withComment: boolean, entryId: string) => {
    if (!loginState?.ethAddress) {
      showLoginModal();
      return;
    } else {
      props.navigateToModal({ name: 'editor', embedEntry: entryId });
    }
  };

  const handleFlipCard = (entryId: string) => {
    setReportedItems(prev => prev.filter(el => el !== entryId));
  };

  const emptySearchState =
    searchState?.profiles.length === 0 &&
    searchState?.entries.length === 0 &&
    searchState?.comments.length === 0 &&
    searchState?.tags.length === 0;

  const [activeButton, setActiveButton] = React.useState<string>(ButtonValues.ALL);

  const buttonValues = [
    ButtonValues.ALL,
    ButtonValues.PEOPLE,
    ButtonValues.TOPICS,
    ButtonValues.POSTS,
    ButtonValues.REPLIES,
  ];
  const buttonLabels = buttonValues.map(value => t(value));

  const onTabClick = (value: string) => {
    setActiveButton(buttonValues[buttonLabels.indexOf(value)]);
  };

  const onNavBack = () => {
    history.back();
  };

  const searchCount = searchState
    ? searchState.profiles?.length +
      searchState.entries?.length +
      searchState.tags?.length +
      searchState.comments?.length
    : 0;

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
        loggedUser={loginState?.pubKey}
      />

      {searchReq.isFetching && (
        <BasicCardBox>
          <Box pad="large">
            <Spinner />
          </Box>
        </BasicCardBox>
      )}
      {!searchReq.isFetching && emptySearchState && (
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

      {!searchReq.isFetching && !emptySearchState && (
        <Box>
          {(activeButton === ButtonValues.ALL || activeButton === ButtonValues.PEOPLE) &&
            searchState?.profiles.slice(0, 4).map((profileData: IProfileData, index: number) => (
              <Box key={index} pad={{ bottom: 'medium' }}>
                <ProfileSearchCard
                  handleFollow={() => handleFollowProfile(profileData.ethAddress)}
                  handleUnfollow={() => handleUnfollowProfile(profileData.ethAddress)}
                  isFollowing={followedProfiles.includes(profileData?.ethAddress)}
                  loggedEthAddress={loginState?.ethAddress}
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

          {(activeButton === ButtonValues.ALL || activeButton === ButtonValues.TOPICS) &&
            searchState?.tags.map((tag: ITag, index: number) => (
              <Box key={index} pad={{ bottom: 'medium' }}>
                <TagSearchCard
                  tag={tag}
                  subscribedTags={tagSubscriptionsState}
                  subscribeLabel={t('Subscribe')}
                  unsubscribeLabel={t('Unsubscribe')}
                  tagAnchorLink={'/social-app/tags'}
                  onClickTag={() => handleTagClick(tag.name)}
                  handleSubscribeTag={handleTagSubscribe}
                  handleUnsubscribeTag={handleTagSubscribe}
                />
              </Box>
            ))}
          {(activeButton === ButtonValues.ALL || activeButton === ButtonValues.POSTS) &&
            searchState?.entries.slice(0, 4).map((entryData: IEntryData, index: number) => (
              <Box key={index} pad={{ bottom: 'medium' }}>
                {entryData.moderated && entryData.delisted && (
                  <EntryCardHidden
                    moderatedContentLabel={t('This content has been moderated')}
                    isDelisted={true}
                  />
                )}
                {!entryData.moderated && reportedItems.includes(entryData.entryId) && (
                  <EntryCardHidden
                    reason={entryData.reason}
                    headerTextLabel={t('You reported this post for the following reason')}
                    footerTextLabel={t('It is awaiting moderation.')}
                    ctaLabel={t('See it anyway')}
                    handleFlipCard={() => handleFlipCard(entryData.entryId)}
                  />
                )}
                {!reportedItems.includes(entryData.entryId) && (
                  <EntryCard
                    isRemoved={entryData.isRemoved}
                    isBookmarked={bookmarks?.findIndex(bm => bm.entryId === entryData.entryId) >= 0}
                    entryData={entryData}
                    sharePostLabel={t('Share Post')}
                    shareTextLabel={t('Share this post with your friends')}
                    sharePostUrl={`${window.location.origin}/social-app/post/`}
                    onClickAvatar={() => handleProfileClick(entryData.author.pubKey)}
                    onEntryBookmark={handleEntryBookmark(ItemTypes.ENTRY)}
                    repliesLabel={t('Replies')}
                    repostsLabel={t('Reposts')}
                    repostLabel={t('Repost')}
                    repostWithCommentLabel={t('Repost with comment')}
                    shareLabel={t('Share')}
                    copyLinkLabel={t('Copy Link')}
                    flagAsLabel={t('Report Post')}
                    loggedProfileEthAddress={loginState?.ethAddress}
                    locale={locale || 'en'}
                    style={{ height: 'auto' }}
                    bookmarkLabel={t('Save')}
                    bookmarkedLabel={t('Saved')}
                    showMore={true}
                    profileAnchorLink={'/profile'}
                    repliesAnchorLink={'/social-app/post'}
                    onRepost={handleRepost}
                    onEntryFlag={handleEntryFlag(entryData.entryId, 'post')}
                    handleFollowAuthor={() => handleFollowProfile(entryData.author.ethAddress)}
                    handleUnfollowAuthor={() => handleUnfollowProfile(entryData.author.ethAddress)}
                    isFollowingAuthor={followedProfiles.includes(entryData.author.pubKey)}
                    onContentClick={() => handlePostClick(entryData.entryId)}
                    onMentionClick={handleProfileClick}
                    onTagClick={handleTagClick}
                    singleSpaNavigate={singleSpa.navigateToUrl}
                    contentClickable={true}
                    handleFlipCard={() => handleFlipCard(entryData.entryId)}
                  />
                )}
              </Box>
            ))}
          {(activeButton === ButtonValues.ALL || activeButton === ButtonValues.REPLIES) &&
            searchState?.comments.slice(0, 4).map((commentData: IEntryData, index: number) => (
              <Box key={index} pad={{ bottom: 'medium' }}>
                {commentData.moderated && commentData.delisted && (
                  <EntryCardHidden
                    moderatedContentLabel={t('This content has been moderated')}
                    isDelisted={true}
                  />
                )}
                {!commentData.moderated && reportedItems.includes(commentData.entryId) && (
                  <EntryCardHidden
                    reason={commentData.reason}
                    headerTextLabel={t('You reported this reply for the following reason')}
                    footerTextLabel={t('It is awaiting moderation.')}
                    ctaLabel={t('See it anyway')}
                    handleFlipCard={() => handleFlipCard(commentData.entryId)}
                  />
                )}
                {!reportedItems.includes(commentData.entryId) && (
                  <EntryCard
                    isRemoved={commentData.isRemoved}
                    isBookmarked={
                      bookmarks?.findIndex(bm => bm.entryId === commentData.entryId) >= 0
                    }
                    entryData={commentData}
                    sharePostLabel={t('Share Post')}
                    shareTextLabel={t('Share this post with your friends')}
                    sharePostUrl={'https://ethereum.world'}
                    onClickAvatar={() => handleProfileClick(commentData.author.pubKey)}
                    onEntryBookmark={handleEntryBookmark(ItemTypes.COMMENT)}
                    repliesLabel={t('Replies')}
                    repostsLabel={t('Reposts')}
                    repostLabel={t('Repost')}
                    repostWithCommentLabel={t('Repost with comment')}
                    shareLabel={t('Share')}
                    copyLinkLabel={t('Copy Link')}
                    flagAsLabel={t('Report Comment')}
                    loggedProfileEthAddress={loginState?.ethAddress}
                    locale={locale || 'en'}
                    style={{ height: 'auto' }}
                    bookmarkLabel={t('Save')}
                    bookmarkedLabel={t('Saved')}
                    showMore={true}
                    profileAnchorLink={'/profile'}
                    repliesAnchorLink={'/social-app/post'}
                    onRepost={() => null}
                    onEntryFlag={handleEntryFlag(commentData.entryId, 'reply')}
                    handleFollowAuthor={() => handleFollowProfile(commentData.author.ethAddress)}
                    handleUnfollowAuthor={() =>
                      handleUnfollowProfile(commentData.author.ethAddress)
                    }
                    isFollowingAuthor={followedProfiles.includes(commentData.author.pubKey)}
                    onContentClick={() => handlePostClick(commentData.postId)}
                    onMentionClick={handleProfileClick}
                    onTagClick={handleTagClick}
                    singleSpaNavigate={singleSpa.navigateToUrl}
                    contentClickable={true}
                    handleFlipCard={() => handleFlipCard(commentData.entryId)}
                  />
                )}
              </Box>
            ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchPage;
