import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import { ILocale } from '@akashaorg/design-system/lib/utils/time';
import { IProfileData } from '@akashaorg/ui-awf-typings/src/profile';
import { IEntryData, ITag } from '@akashaorg/ui-awf-typings/src/entry';
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
  useEntryNavigation,
  useAnalytics,
} from '@akashaorg/ui-awf-hooks';
import { ItemTypes, ModalNavigationOptions } from '@akashaorg/ui-awf-typings/lib/app-loader';
import { AnalyticsCategories } from '@akashaorg/ui-awf-typings/lib/analytics';
import { SearchTagsResult_Response } from '@akashaorg/sdk-typings/lib/interfaces/responses';

import EntryCardRenderer from './entry-renderer';

const {
  Box,
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

type DataResponse = SearchTagsResult_Response | IEntryData;

const initSearchState = {
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

  const navigateTo = props.plugins?.routing?.navigateTo;
  const handleEntryNavigation = useEntryNavigation(navigateTo);

  const isAllTabActive = React.useMemo(() => activeButton === ButtonValues.ALL, [activeButton]);

  const updateSearchState = (
    type: Exclude<ButtonValues, ButtonValues.ALL>,
    data: Array<DataResponse & { delisted?: boolean }>,
  ) => {
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
        results: [...prevState[type].results, ...data.filter(_ => !_.delisted)],
        // topics edge case because it only fetches once
        done: type === ButtonValues.TOPICS || prevState[type].done,
        isLoading: false,
      },
    }));
  };

  const handleLoadMore = () => {
    if (isAllTabActive) return;
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

  const getSearchStateForTab = (tab: Exclude<ButtonValues, ButtonValues.ALL>) => {
    if (activeButton === ButtonValues.ALL) {
      return searchState[tab].results.slice(0, 4);
    }
    return searchState[tab].results;
  };

  React.useEffect(() => {
    if (isAllTabActive) {
      return setSearchState(initSearchState);
    }
    setSearchState({
      ...initSearchState,
      [activeButton]: { ...initSearchState[activeButton], isLoading: true },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword]);

  const searchProfilesReq = useSearchProfiles(
    decodeURIComponent(searchKeyword),
    searchState[ButtonValues.PEOPLE].page,
    loginState?.pubKey,
    loginState?.fromCache,
  );
  const searchProfilesState = getSearchStateForTab(ButtonValues.PEOPLE);

  const searchPostsReq = useSearchPosts(
    decodeURIComponent(searchKeyword),
    searchState[ButtonValues.POSTS].page,
    loginState?.pubKey,
    loginState?.fromCache,
  );
  const searchPostsState = getSearchStateForTab(ButtonValues.POSTS);

  const searchCommentsReq = useSearchComments(
    decodeURIComponent(searchKeyword),
    searchState[ButtonValues.REPLIES].page,
    loginState?.pubKey,
    loginState?.fromCache,
  );
  const searchCommentsState = searchState[ButtonValues.REPLIES].results;

  const searchTagsReq = useSearchTags(decodeURIComponent(searchKeyword));
  const searchTagsState = getSearchStateForTab(ButtonValues.TOPICS);

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

  React.useEffect(() => {
    if (searchTagsReq.isFetched) updateSearchState(ButtonValues.TOPICS, searchTagsReq.data);
  }, [searchTagsReq.data, searchTagsReq.isFetched]);

  const followPubKeyArr = searchProfilesState?.map(profile => profile.pubKey);
  const isFollowingMultipleReq = useIsFollowingMultiple(loginState?.pubKey, followPubKeyArr);
  const followedProfiles = isFollowingMultipleReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const handleTagSubscribe = (subscribe: boolean) => (tagName: string) => {
    if (!loginState?.ethAddress) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.FILTER_SEARCH,
      action: subscribe ? 'Trending Topic Subscribed' : 'Trending Topic Unsubscribed',
    });
    toggleTagSubscriptionReq.mutate(tagName);
  };

  const handleProfileClick = (pubKey: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${pubKey}`,
    });
  };
  const handleFollowProfile = (pubKey: string) => {
    if (!loginState?.ethAddress) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.FILTER_SEARCH,
      action: 'Trending People Followed',
    });
    followReq.mutate(pubKey);
  };

  const handleSearch = (inputValue: string) => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;
    const encodedSearchKey = encodeURIComponent(trimmedValue);
    props.plugins?.routing?.navigateTo?.({
      appName: '@akashaorg/app-search',
      getNavigationUrl: routes => `${routes.Results}/${encodedSearchKey}`,
    });
  };

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => {
    ev.preventDefault();
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${authorEth}`,
    });
  };

  const handleMentionClick = (profileEthAddress: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profileEthAddress}`,
    });
  };

  const handleUnfollowProfile = (pubKey: string) => {
    if (!loginState?.ethAddress) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.FILTER_SEARCH,
      action: 'Trending People Unfollowed',
    });
    unfollowReq.mutate(pubKey);
  };

  const handleTagClick = (name: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${name}`,
    });
  };

  // repost related
  const handleRepost = (_withComment: boolean, entryId: string) => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.POST,
      action: 'Repost Clicked',
    });
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
        action: `Filter Search By ${activeButton}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const isFetchingSearch = React.useMemo(() => {
    if (activeButton === ButtonValues.ALL) {
      return !allQueriesFinished;
    }
    return searchKeyword && !searchState[activeButton].done;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState, activeButton, allQueriesFinished]);

  return (
    <Box fill="horizontal">
      <SearchStartCard
        searchKeyword={searchKeyword}
        handleSearch={handleSearch}
        inputPlaceholderLabel={t('Search')}
        titleLabel={t('Search')}
        introLabel={t('✨ Find what you are looking for ✨')}
        description={t('Search for your favourite topics, people, posts and replies.')}
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
          style={{ marginBottom: '-1px' }} // overlaps border with parent's bottom border
        />
      </SearchStartCard>

      {allQueriesFinished &&
        searchKeyword &&
        (isAllTabActive ? emptySearchState : !searchState[activeButton]?.results?.length) && (
          <Box margin={{ top: 'medium' }}>
            <InfoCard
              icon="search"
              title={t('No matching results found 👀')}
              explanation={t('We could not find any results for your search in Ethereum World.')}
              suggestion={t(
                'Make sure you spelled everything correctly or try searching for something else.',
              )}
            />
          </Box>
        )}

      <Box margin={{ top: 'medium' }}>
        {(activeButton === ButtonValues.ALL || activeButton === ButtonValues.PEOPLE) &&
          searchProfilesState?.map((profileData: IProfileData, index: number) => (
            <Box key={index} pad={{ bottom: 'medium' }}>
              <ProfileSearchCard
                handleFollow={() => handleFollowProfile(profileData.pubKey)}
                handleUnfollow={() => handleUnfollowProfile(profileData.pubKey)}
                isFollowing={followedProfiles.includes(profileData?.pubKey)}
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
              onContentClick={handleEntryNavigation}
              navigateTo={navigateTo}
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
              pubKey={loginState?.pubKey}
              onContentClick={handleEntryNavigation}
              navigateTo={navigateTo}
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
