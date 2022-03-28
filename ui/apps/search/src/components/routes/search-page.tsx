import * as React from 'react';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { useParams } from 'react-router-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { IProfileData } from '@akashaproject/ui-awf-typings/src/profile';
import { ITag } from '@akashaproject/ui-awf-typings/src/entry';
import { useTranslation } from 'react-i18next';
import {
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
  useAnalytics,
} from '@akashaproject/ui-awf-hooks';
import { ItemTypes, ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import EntryCardRenderer from './entry-renderer';
import { AnalyticsCategories } from '@akashaproject/ui-awf-typings/lib/analytics';

const {
  Box,
  Text,
  styled,
  Spinner,
  ProfileSearchCard,
  TagSearchCard,
  TabsToolbar,
  StyledSwitchCardButton,
  SearchStartCard,
  InfoCard,
  TAB_TOOLBAR_TYPE,
  useIntersectionObserver,
} = DS;

const StyledProfileBox = styled(Box)`
  border: ${props => `1px solid ${props.theme.colors.lightBackground}`};
  border-radius: 0.35rem;
`;

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
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
}

const initSearchState = {
  keyword: '',
  [ButtonValues.TOPICS]: { page: 1, results: [], done: false, isLoading: false },
  [ButtonValues.POSTS]: { page: 1, results: [], done: false, isLoading: false },
  [ButtonValues.PEOPLE]: { page: 1, results: [], done: false, isLoading: false },
  [ButtonValues.REPLIES]: { page: 1, results: [], done: false, isLoading: false },
};

const SearchPage: React.FC<SearchPageProps> = props => {
  const { singleSpa, loginState, showLoginModal } = props;
  const { searchKeyword = '' } = useParams<{ searchKeyword: string }>();
  const [searchState, setSearchState] = React.useState(initSearchState);
  const [activeButton, setActiveButton] = React.useState<ButtonValues>(ButtonValues.ALL);

  const [analyticsActions] = useAnalytics();
  const { t, i18n } = useTranslation('app-search');
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const tagSubscriptionsReq = useTagSubscriptions(loginState?.isReady && loginState?.ethAddress);
  const tagSubscriptionsState = tagSubscriptionsReq.data;

  const toggleTagSubscriptionReq = useToggleTagSubscription();

  const handleNavigation = useHandleNavigation(singleSpa.navigateToUrl);

  const updateSearchState = (type: Exclude<ButtonValues, ButtonValues.ALL>, data: unknown[]) => {
    if (!data || !data.length) {
      setSearchState(prevState => ({
        ...prevState,
        [type]: { ...prevState[type], done: true, isLoading: false },
      }));
    }
    setSearchState(prevState => ({
      ...prevState,
      [type]: {
        ...prevState[type],
        results: [...prevState[type].results, ...data],
        isLoading: false,
      },
    }));
  };

  const handleLoadMore = () => {
    if (activeButton === ButtonValues.ALL) return;
    const { done, isLoading } = searchState[activeButton];
    if (done || isLoading) return;

    setSearchState(prevState => ({
      ...prevState,
      [activeButton]: {
        ...prevState[activeButton],
        page: prevState[activeButton].page + 1,
        isLoading: true,
      },
    }));
  };
  const loadmoreRef = React.createRef<HTMLDivElement>();

  useIntersectionObserver({
    target: loadmoreRef,
    onIntersect: handleLoadMore,
    threshold: 0,
  });

  React.useEffect(() => {
    if (activeButton === ButtonValues.ALL) {
      return setSearchState({ ...initSearchState, keyword: searchKeyword });
    }
    setSearchState({
      ...initSearchState,
      keyword: searchKeyword,
      [activeButton]: { ...initSearchState[activeButton], isLoading: true },
    });
  }, [searchKeyword]);

  const searchProfilesReq = useSearchProfiles(
    decodeURIComponent(searchState.keyword),
    searchState[ButtonValues.PEOPLE].page,
    loginState?.pubKey,
    loginState?.fromCache,
  );
  const searchProfilesState = searchState[ButtonValues.PEOPLE].results;

  const searchPostsReq = useSearchPosts(
    decodeURIComponent(searchState.keyword),
    searchState[ButtonValues.POSTS].page,
    loginState?.pubKey,
    loginState?.fromCache,
  );
  const searchPostsState = searchState[ButtonValues.POSTS].results;

  const searchCommentsReq = useSearchComments(
    decodeURIComponent(searchState.keyword),
    searchState[ButtonValues.REPLIES].page,
    loginState?.pubKey,
    loginState?.fromCache,
  );
  const searchCommentsState = searchState[ButtonValues.REPLIES].results;

  const searchTagsReq = useSearchTags(decodeURIComponent(searchState.keyword));
  const searchTagsState = searchTagsReq.data;

  React.useEffect(() => {
    if (searchPostsReq.isFetched) updateSearchState(ButtonValues.POSTS, searchPostsReq.data);
  }, [searchPostsReq.data, searchPostsReq.isFetched]);

  React.useEffect(() => {
    if (searchCommentsReq.isFetched)
      updateSearchState(ButtonValues.REPLIES, searchCommentsReq.data);
  }, [searchCommentsReq.data, searchCommentsReq.isFetched]);

  React.useEffect(() => {
    if (searchProfilesReq.isFetched) {
      updateSearchState(ButtonValues.PEOPLE, searchProfilesReq.data);
    }
  }, [searchProfilesReq.data, searchProfilesReq.isFetched]);

  const followEthAddressArr = searchProfilesState?.map(profile => profile.ethAddress);
  const isFollowingMultipleReq = useIsFollowingMultiple(
    loginState?.ethAddress,
    followEthAddressArr,
  );
  const followedProfiles = isFollowingMultipleReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const handleTagSubscribe = (subscribe: boolean) => (tagName: string) => {
    if (!loginState?.ethAddress) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.TRENDING_TOPIC,
      action: subscribe ? 'Subscribe' : 'Unsubscribe',
      name: subscribe ? 'Subscribed Topic From Feed' : 'Unsubscribed Topic From Feed',
    });
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
    analyticsActions.trackEvent({
      category: AnalyticsCategories.PEOPLE,
      action: 'Subscribe',
      name: 'Feed',
    });
    followReq.mutate(ethAddress);
  };

  const handleSearch = (inputValue: string) => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;
    const encodedSearchKey = encodeURIComponent(trimmedValue);
    props.plugins?.routing?.navigateTo?.({
      appName: '@akashaproject/app-search',
      getNavigationUrl: routes => `${routes.rootRoute}/${encodedSearchKey}`,
    });
  };

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => {
    props.singleSpa.navigateToUrl(`/profile/${authorEth}`);
    ev.preventDefault();
  };

  const handleMentionClick = (profileEthAddress: string) => {
    props.singleSpa.navigateToUrl(`/profile/${profileEthAddress}`);
  };

  const handleUnfollowProfile = (ethAddress: string) => {
    if (!loginState?.ethAddress) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.PEOPLE,
      action: 'Unsubscribe',
      name: 'Feed',
    });
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

  React.useEffect(() => {
    if (activeButton !== ButtonValues.ALL) {
      analyticsActions.trackEvent({
        category: AnalyticsCategories.FILTER_SEARCH,
        action: `By ${activeButton}`,
      });
    }
  }, [activeButton]);

  const buttonValues = [
    {
      value: ButtonValues.ALL,
      label: t('{{ buttonValueAll }}', { buttonValueAll: ButtonValues.ALL }),
    },
    {
      value: ButtonValues.PEOPLE,
      label: t('{{ buttonValuePeople }}', { buttonValuePeople: ButtonValues.PEOPLE }),
    },
    {
      value: ButtonValues.TOPICS,
      label: t('{{ buttonValueTopics }}', { buttonValueTopics: ButtonValues.TOPICS }),
    },
    {
      value: ButtonValues.POSTS,
      label: t('{{ buttonValuePosts }}', { buttonValuePosts: ButtonValues.POSTS }),
    },
    {
      value: ButtonValues.REPLIES,
      label: t('{{ buttonValueReplies }}', { buttonValueReplies: ButtonValues.REPLIES }),
    },
  ];

  const onTabClick = (value: ButtonValues) => () => {
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
    if (activeButton === ButtonValues.ALL || activeButton === ButtonValues.TOPICS) return false;
    return searchState.keyword && !searchState[activeButton].done;
  }, [searchState, activeButton]);

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
      <SearchStartCard
        searchKeywordParam={searchKeyword}
        handleSearch={handleSearch}
        inputPlaceholderLabel={t('Search')}
        title={t('✨ Find what you are looking for ✨')}
        description={t(
          'To create your unique feed view, subscribe to your favourite topics and find wonderful people to follow in our community.',
        )}
      >
        <TabsToolbar
          noMarginBottom
          count={searchCount}
          countLabel={t('Results')}
          activeButton={activeButton}
          tabForm={TAB_TOOLBAR_TYPE.WIDE}
          tabButtons={
            <>
              <StyledSwitchCardButton
                label={t('{{ buttonValuesAll }}', { buttonValuesAll: ButtonValues.ALL })}
                size="large"
                removeBorder={false}
                primary={ButtonValues.ALL === activeButton}
                onClick={onTabClick(ButtonValues.ALL)}
              />
              <StyledSwitchCardButton
                label={t('{{ buttonValuesPeople }}', { buttonValuesPeople: ButtonValues.PEOPLE })}
                size="large"
                removeBorder={true}
                primary={ButtonValues.PEOPLE === activeButton}
                onClick={onTabClick(ButtonValues.PEOPLE)}
              />
              <StyledSwitchCardButton
                label={t('{{ buttonValuesTopics }}', { buttonValuesTopics: ButtonValues.TOPICS })}
                size="large"
                removeBorder={true}
                primary={ButtonValues.TOPICS === activeButton}
                onClick={onTabClick(ButtonValues.TOPICS)}
              />
              <StyledSwitchCardButton
                label={t('{{ buttonValuesPosts }}', { buttonValuesPosts: ButtonValues.POSTS })}
                size="large"
                removeBorder={true}
                primary={ButtonValues.POSTS === activeButton}
                onClick={onTabClick(ButtonValues.POSTS)}
              />
              <StyledSwitchCardButton
                label={t('{{ buttonValuesReplies }}', {
                  buttonValuesReplies: ButtonValues.REPLIES,
                })}
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
          buttonValues={buttonValues}
          loggedUser={loginState?.pubKey}
        />
      </SearchStartCard>

      {allQueriesFinished && searchState.keyword && emptySearchState && (
        <InfoCard
          icon="search"
          title={t('No matching results found 👀')}
          explanation={t('We could not find any results for your search in Ethereum World.')}
          suggestion={t(
            'Make sure you spelled everything correctly or try searching for something else.',
          )}
        />
      )}

      <Box margin={{ horizontal: 'small' }}>
        {activeButton === ButtonValues.ALL &&
          searchProfilesState?.map((profileData: IProfileData, index: number) => (
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
        {activeButton === ButtonValues.PEOPLE && !!searchProfilesState?.length && (
          <StyledProfileBox pad="medium">
            <Text
              weight="bold"
              size="xlarge"
              margin={{ horizontal: 'medium', bottom: 'medium', top: 'xxsmall' }}
            >
              PEOPLE
            </Text>
            {searchProfilesState?.map((profileData: IProfileData, index: number) => (
              <Box key={index}>
                <ProfileSearchCard
                  className="people-only"
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
                  showPostCount={false}
                />
              </Box>
            ))}
          </StyledProfileBox>
        )}

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
                handleSubscribeTag={handleTagSubscribe(true)}
                handleUnsubscribeTag={handleTagSubscribe(false)}
              />
            </Box>
          ))}
        {(activeButton === ButtonValues.ALL || activeButton === ButtonValues.POSTS) &&
          searchPostsState?.map(itemData => (
            <EntryCardRenderer
              key={itemData.entryId}
              itemData={itemData}
              itemType={ItemTypes.ENTRY}
              logger={props.logger}
              singleSpa={singleSpa}
              ethAddress={loginState?.ethAddress}
              onNavigate={handleNavigation}
              onRepost={handleRepost}
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
          searchCommentsState?.map(itemData => (
            <EntryCardRenderer
              key={itemData.entryId}
              itemData={itemData}
              itemType={ItemTypes.COMMENT}
              logger={props.logger}
              singleSpa={singleSpa}
              ethAddress={loginState?.ethAddress}
              onNavigate={handleNavigation}
              onRepost={handleRepost}
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
        <Box pad="large">
          <Spinner />
        </Box>
      )}
      {/* triggers intersection observer */}
      <Box pad="xxsmall" ref={loadmoreRef} />
    </Box>
  );
};

export default React.memo(SearchPage);
