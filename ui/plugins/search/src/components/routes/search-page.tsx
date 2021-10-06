import * as React from 'react';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { useParams } from 'react-router-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { IProfileData } from '@akashaproject/ui-awf-typings/src/profile';
import { ITag } from '@akashaproject/ui-awf-typings/src/entry';
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
import EntryCardRenderer from './entry-renderer';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';

const { Box, BasicCardBox, ErrorLoader, Spinner, ProfileSearchCard, TagSearchCard, SwitchCard } =
  DS;

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
  const { searchKeyword } = useParams<{ searchKeyword: string }>();

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const bookmarksQuery = useGetBookmarks(loginState?.isReady && loginState?.ethAddress);
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

  const handleNavigation = (itemType: ItemTypes, details: IContentClickDetails) => {
    let url;
    switch (itemType) {
      case ItemTypes.PROFILE:
        url = `/profile/${details.entryId}`;
        break;
      case ItemTypes.TAG:
        url = `/social-app/tags/${details.entryId}`;
        break;
      case ItemTypes.ENTRY:
        url = `/social-app/post/${details.entryId}`;
        break;
      default:
        break;
    }
    props.singleSpa.navigateToUrl(url);
  };

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => {
    props.singleSpa.navigateToUrl(`/profile/${authorEth}`);
    ev.preventDefault();
  };

  const handleMentionClick = (profileEthAddress: string) => {
    props.singleSpa.navigateToUrl(`/profile/${profileEthAddress}`);
  };

  const handleBookmark = (isBookmarked: boolean, entryId: string, itemType: ItemTypes) => {
    if (loginState?.pubKey) {
      if (!isBookmarked) {
        return addBookmark.mutate({
          entryId,
          itemType,
        });
      }
      return deleteBookmark.mutate(entryId);
    } else {
      showLoginModal();
    }
  };

  const handleUnfollowProfile = (ethAddress: string) => {
    if (!loginState?.ethAddress) {
      showLoginModal();
      return;
    }
    unfollowReq.mutate(ethAddress);
  };

  const handleTagClick = (name: string) => {
    props.singleSpa.navigateToUrl(`/social-app/tags/${name}`);
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
            searchState?.entries
              .slice(0, 4)
              .map(itemData => (
                <EntryCardRenderer
                  key={itemData.entryId}
                  itemData={itemData}
                  itemType={ItemTypes.ENTRY}
                  logger={props.logger}
                  bookmarksQuery={bookmarksQuery}
                  singleSpa={singleSpa}
                  ethAddress={loginState?.ethAddress}
                  onNavigate={handleNavigation}
                  onRepost={handleRepost}
                  onBookmark={handleBookmark}
                  onAvatarClick={handleAvatarClick}
                  onMentionClick={handleMentionClick}
                  onTagClick={handleTagClick}
                  contentClickable={true}
                  locale={locale}
                  sharePostUrl={`${window.location.origin}/social-app/post/`}
                  moderatedContentLabel={t('This content has been moderated')}
                  ctaLabel={t('See it anyway')}
                  uiEvents={props.uiEvents}
                  navigateToModal={props.navigateToModal}
                />
              ))}
          {(activeButton === ButtonValues.ALL || activeButton === ButtonValues.REPLIES) &&
            searchState?.comments
              .slice(0, 4)
              .map(itemData => (
                <EntryCardRenderer
                  key={itemData.entryId}
                  itemData={itemData}
                  itemType={ItemTypes.COMMENT}
                  logger={props.logger}
                  bookmarksQuery={bookmarksQuery}
                  singleSpa={singleSpa}
                  ethAddress={loginState?.ethAddress}
                  onNavigate={handleNavigation}
                  onRepost={handleRepost}
                  onBookmark={handleBookmark}
                  onAvatarClick={handleAvatarClick}
                  onMentionClick={handleMentionClick}
                  onTagClick={handleTagClick}
                  contentClickable={true}
                  locale={locale}
                  sharePostUrl={`${window.location.origin}/social-app/post/`}
                  moderatedContentLabel={t('This content has been moderated')}
                  ctaLabel={t('See it anyway')}
                  uiEvents={props.uiEvents}
                  navigateToModal={props.navigateToModal}
                />
              ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchPage;
