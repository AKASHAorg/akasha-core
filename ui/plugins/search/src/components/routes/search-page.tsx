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
  useTagSubscriptions,
  useToggleTagSubscription,
  useIsFollowingMultiple,
  useFollow,
  useUnfollow,
  useSearchPosts,
  useSearchProfiles,
  useSearchComments,
  useSearchTags,
  LoginState,
  useHandleNavigation,
} from '@akashaproject/ui-awf-hooks';
import { ItemTypes, ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import EntryCardRenderer from './entry-renderer';

const {
  styled,
  Box,
  BasicCardBox,
  ErrorLoader,
  Spinner,
  ProfileSearchCard,
  TagSearchCard,
  SwitchCard,
  StyledSwitchCardButton,
} = DS;

export enum ButtonValues {
  ALL = 'All',
  PEOPLE = 'People',
  TOPICS = 'Topics',
  POSTS = 'Posts',
  REPLIES = 'Replies',
}

const TabsToolbar = styled(SwitchCard)`
  font-synthesis: initial;
  @media only screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    margin-bottom: 0;
  }
  ${StyledSwitchCardButton}:first-child {
    border-radius: 0.25rem 0rem 0rem 0.25rem;
  }
  ${StyledSwitchCardButton}:last-child {
    border-radius: 0rem 0.25rem 0.25rem 0rem;
  }
`;

interface SearchPageProps extends RootComponentProps {
  onError?: (err: Error) => void;
  loginState: LoginState;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
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

  const handleNavigation = useHandleNavigation(singleSpa.navigateToUrl);

  const searchProfilesReq = useSearchProfiles(
    decodeURIComponent(searchKeyword),
    loginState?.pubKey,
    loginState?.fromCache,
  );
  const searchProfilesState = searchProfilesReq.data;

  const searchPostsReq = useSearchPosts(
    decodeURIComponent(searchKeyword),
    loginState?.pubKey,
    loginState?.fromCache,
  );
  const searchPostsState = searchPostsReq.data;

  const searchCommentsReq = useSearchComments(
    decodeURIComponent(searchKeyword),
    loginState?.pubKey,
    loginState?.fromCache,
  );
  const searchCommentsState = searchCommentsReq.data;

  const searchTagsReq = useSearchTags(decodeURIComponent(searchKeyword));
  const searchTagsState = searchTagsReq.data;

  const followEthAddressArr = searchProfilesState?.slice(0, 4).map(profile => profile.ethAddress);
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
    searchProfilesState?.length === 0 &&
    searchPostsState?.length === 0 &&
    searchCommentsState?.length === 0 &&
    searchTagsState?.length === 0;

  const [activeButton, setActiveButton] = React.useState<string>(ButtonValues.ALL);

  const buttonValues = [
    ButtonValues.ALL,
    ButtonValues.PEOPLE,
    ButtonValues.TOPICS,
    ButtonValues.POSTS,
    ButtonValues.REPLIES,
  ];
  const buttonLabels = buttonValues.map(value => t(value));

  const onTabClick = (value: string) => () => {
    setActiveButton(value);
  };

  const onNavBack = () => {
    history.back();
  };

  const searchCount =
    searchProfilesState?.length ||
    0 + searchPostsState?.length ||
    0 + searchCommentsState?.length ||
    0 + searchTagsState?.length ||
    0;

  const isFetchingSearch = React.useMemo(() => {
    return (
      searchProfilesReq.isFetching ||
      searchPostsReq.isFetching ||
      searchCommentsReq.isFetching ||
      searchTagsReq.isFetching
    );
  }, [
    searchCommentsReq.isFetching,
    searchPostsReq.isFetching,
    searchProfilesReq.isFetching,
    searchTagsReq.isFetching,
  ]);

  const allQueriesFinished = React.useMemo(() => {
    return (
      !searchProfilesReq.isFetching &&
      !searchPostsReq.isFetching &&
      !searchCommentsReq.isFetching &&
      !searchTagsReq.isFetching
    );
  }, [
    searchCommentsReq.isFetching,
    searchPostsReq.isFetching,
    searchProfilesReq.isFetching,
    searchTagsReq.isFetching,
  ]);

  return (
    <Box fill="horizontal">
      <TabsToolbar
        count={searchCount}
        countLabel={t('Results')}
        activeButton={activeButton}
        tabButtons={
          <>
            <StyledSwitchCardButton
              label={t(ButtonValues.ALL)}
              size="large"
              removeBorder={false}
              primary={ButtonValues.ALL === activeButton}
              onClick={onTabClick(ButtonValues.ALL)}
            />
            <StyledSwitchCardButton
              label={t(ButtonValues.PEOPLE)}
              size="large"
              removeBorder={true}
              primary={ButtonValues.PEOPLE === activeButton}
              onClick={onTabClick(ButtonValues.PEOPLE)}
            />
            <StyledSwitchCardButton
              label={t(ButtonValues.TOPICS)}
              size="large"
              removeBorder={true}
              primary={ButtonValues.TOPICS === activeButton}
              onClick={onTabClick(ButtonValues.TOPICS)}
            />
            <StyledSwitchCardButton
              label={t(ButtonValues.POSTS)}
              size="large"
              removeBorder={true}
              primary={ButtonValues.POSTS === activeButton}
              onClick={onTabClick(ButtonValues.POSTS)}
            />
            <StyledSwitchCardButton
              label={t(ButtonValues.REPLIES)}
              size="large"
              removeBorder={true}
              primary={ButtonValues.REPLIES === activeButton}
              onClick={onTabClick(ButtonValues.REPLIES)}
            />
          </>
        }
        onTabClick={onTabClick}
        onIconClick={onNavBack}
        hasIcon={true}
        hasMobileDesign={true}
        buttonLabels={buttonLabels}
        buttonValues={buttonValues}
        loggedUser={loginState?.pubKey}
      />
      {allQueriesFinished && emptySearchState && (
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

      <Box>
        {(activeButton === ButtonValues.ALL || activeButton === ButtonValues.PEOPLE) &&
          searchProfilesState?.slice(0, 4).map((profileData: IProfileData, index: number) => (
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
          searchTagsState?.map((tag: ITag, index: number) => (
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
          searchPostsState
            ?.slice(0, 4)
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
                modalSlotId={props.layoutConfig.modalSlotId}
              />
            ))}
        {(activeButton === ButtonValues.ALL || activeButton === ButtonValues.REPLIES) &&
          searchCommentsState
            ?.slice(0, 4)
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
                modalSlotId={props.layoutConfig.modalSlotId}
              />
            ))}
      </Box>
      {isFetchingSearch && (
        <BasicCardBox>
          <Box pad="large">
            <Spinner />
          </Box>
        </BasicCardBox>
      )}
    </Box>
  );
};

export default SearchPage;
