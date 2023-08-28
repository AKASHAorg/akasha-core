import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { tw } from '@twind/core';
import {
  RootComponentProps,
  IEntryData,
  ITag,
  EntityTypes,
  ModalNavigationOptions,
  AnalyticsCategories,
  Profile,
} from '@akashaorg/typings/ui';

import { ILocale } from '@akashaorg/design-system-core/lib/utils/time';
import routes, { SETTINGS } from '../../routes';

import { useEntryNavigation, useAnalytics } from '@akashaorg/ui-awf-hooks';

import { SearchTagsResult } from '@akashaorg/typings/sdk/graphql-types';

import EntryCardRenderer from './entry-renderer';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import ProfileSearchCard from '@akashaorg/design-system-components/lib/components/ProfileSearchCard';
import DefaultEmptyCard from '@akashaorg/design-system-components/lib/components/DefaultEmptyCard';
import SearchStartCard from '@akashaorg/design-system-components/lib/components/SearchStartCard';
import SearchAppFilter from '@akashaorg/design-system-components/lib/components/SearchAppFilter';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import SwitchCard from '@akashaorg/design-system-components/lib/components/SwitchCard';
import TagSearchCard from '@akashaorg/design-system-components/lib/components/TagSearchCard';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { DropdownMenuItemGroupType } from '@akashaorg/design-system-components/lib/components/SearchAppDropdownFilter';
import SearchResultCount from './search-result-count';
import useIntersectionObserver from '@akashaorg/design-system-core/lib/utils/intersection-observer';

export enum ButtonValues {
  CONTENT = 'Content',
  PEOPLE = 'People',
  TAGS = 'Tags',
}

interface SearchPageProps extends RootComponentProps {
  onError?: (err: Error) => void;
  loggedProfileData: Profile;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
}

type DataResponse = SearchTagsResult | IEntryData;

const initSearchState = {
  [ButtonValues.CONTENT]: { page: 1, results: [], done: false, isLoading: false },
  [ButtonValues.PEOPLE]: { page: 1, results: [], done: false, isLoading: false },
  [ButtonValues.TAGS]: { page: 1, results: [], done: false, isLoading: false },
};

const onNavBack = () => {
  history.back();
};

const SearchPage: React.FC<SearchPageProps> = props => {
  const {
    plugins,
    loggedProfileData,
    logger,
    singleSpa,
    uiEvents,
    showLoginModal,
    navigateToModal,
  } = props;
  const { searchKeyword = '' } = useParams<{ searchKeyword: string }>();
  const [searchState, setSearchState] = React.useState(initSearchState);
  const [activeButton, setActiveButton] = React.useState<ButtonValues>(ButtonValues.CONTENT);

  const [analyticsActions] = useAnalytics();
  const { t, i18n } = useTranslation('app-search');
  const locale = (i18n.languages[0] || 'en') as ILocale;

  // @TODO replace with new hooks
  const tagSubscriptionsReq = null;
  const tagSubscriptionsState = tagSubscriptionsReq?.data;

  const toggleTagSubscriptionReq = null;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;
  const handleEntryNavigation = useEntryNavigation(navigateTo);

  // const isAllTabActive = React.useMemo(() => activeButton === ButtonValues.CONTENT, [activeButton]);

  const dropdownMenuItems: DropdownMenuItemGroupType[] = [
    {
      id: '00',
      title: t('All'),
      type: 'opt',
    },
    {
      id: '11',
      title: 'Antenna',
      type: 'optgroup',
      children: [
        { id: '1', title: 'Beams' },
        { id: '2', title: 'Reflection' },
      ],
    },
    {
      id: '21',
      title: 'Akashaverse',
      type: 'optgroup',
      children: [
        { id: '4', title: 'Apps' },
        { id: '5', title: 'Widgets' },
        { id: '6', title: 'Plugins' },
      ],
    },
  ];

  const [selected, setSelected] = React.useState<DropdownMenuItemGroupType | null>(
    dropdownMenuItems[0],
  );

  const updateSearchState = (
    // type: Exclude<ButtonValues, ButtonValues.PEOPLE>,
    type: ButtonValues,
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
        // tags edge case because it only fetches once
        done: type === ButtonValues.TAGS || prevState[type].done,
        isLoading: false,
      },
    }));
  };

  const handleLoadMore = () => {
    // if (isAllTabActive) return;
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

  const getSearchStateForTab = (tab: ButtonValues) => {
    // if (activeButton === ButtonValues.CONTENT) {
    //   return searchState[tab].results.slice(0, 4);
    // }
    return searchState[tab].results;
  };

  React.useEffect(() => {
    // if (isAllTabActive) {
    //   return setSearchState(initSearchState);
    // }
    setSearchState({
      ...initSearchState,
      [activeButton]: { ...initSearchState[activeButton], isLoading: true },
    });
  }, [searchKeyword]);

  // @TODO replace with new hooks
  const searchProfilesReq = null;
  // const searchProfilesReq = useSearchProfiles(
  //   decodeURIComponent(searchKeyword),
  //   searchState[ButtonValues.PEOPLE].page,
  //   loggedProfileData?.did?.id,
  // );
  const searchProfilesState = getSearchStateForTab(ButtonValues.PEOPLE);

  // const searchBeamsReq = useSearchPosts(
  //   decodeURIComponent(searchKeyword),
  //   searchState[ButtonValues.CONTENT].page,
  //   loggedProfileData?.did?.id,
  // );

  const searchBeamsState = getSearchStateForTab(ButtonValues.CONTENT);

  // const searchCommentsReq = useSearchComments(
  //   decodeURIComponent(searchKeyword),
  //   searchState[ButtonValues.CONTENT].page,
  //   loggedProfileData?.did?.id,
  // );

  // const searchReflectionsState = searchState[ButtonValues.CONTENT].results;
  const searchTagsReq = null;
  // const searchTagsReq = useSearchTags(decodeURIComponent(searchKeyword));
  const searchTagsState = getSearchStateForTab(ButtonValues.TAGS);

  // useEffect(() => {
  //   if (searchBeamsReq.isFetched) {
  //     updateSearchState(ButtonValues.CONTENT, searchBeamsReq.data);
  //   }
  // }, [searchBeamsReq.data, searchBeamsReq.isFetched]);

  // useEffect(() => {
  //   if (searchCommentsReq.isFetched) {
  //     updateSearchState(ButtonValues.CONTENT, searchCommentsReq.data);
  //   }
  // }, [searchCommentsReq.data, searchCommentsReq.isFetched]);

  React.useEffect(() => {
    if (searchProfilesReq.isFetched) {
      updateSearchState(ButtonValues.PEOPLE, searchProfilesReq.data);
    }
  }, [searchProfilesReq, searchProfilesReq.isFetched]);

  React.useEffect(() => {
    if (searchTagsReq.isFetched) updateSearchState(ButtonValues.TAGS, searchTagsReq.data);
  }, [searchTagsReq.data, searchTagsReq.isFetched]);

  const followPubKeyArr = searchProfilesState?.map(profile => profile.pubKey);
  const isFollowingMultipleReq = null;
  const followedProfiles = isFollowingMultipleReq.data;
  const followReq = null;
  const unfollowReq = null;

  const handleTagSubscribe = (subscribe: boolean) => (tagName: string) => {
    if (!loggedProfileData?.did?.id) {
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
    if (!loggedProfileData?.did?.id) {
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
    plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
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
    if (!loggedProfileData?.did?.id) {
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

  // // repost related
  const handleRebeam = (_withComment: boolean, itemId: string) => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.POST,
      action: 'Repost Clicked',
    });
    if (!loggedProfileData?.did?.id) {
      showLoginModal();
      return;
    } else {
      navigateTo?.({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: () => `/feed?repost=${itemId}`,
      });
    }
  };

  // const emptySearchState =
  //   searchProfilesState?.length === 0 &&
  //   searchBeamsState?.length === 0 &&
  //   // searchReflectionsState?.length === 0 &&
  //   searchTagsState?.length === 0;

  React.useEffect(() => {
    if (activeButton !== ButtonValues.CONTENT) {
      analyticsActions.trackEvent({
        category: AnalyticsCategories.FILTER_SEARCH,
        action: `Filter Search By ${activeButton}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeButton]);

  const buttonValues = [
    {
      value: ButtonValues.CONTENT,
      label: t('{{ buttonValueContent }}', { buttonValueContent: ButtonValues.CONTENT }),
    },
    {
      value: ButtonValues.PEOPLE,
      label: t('{{ buttonValuePeople }}', { buttonValuePeople: ButtonValues.PEOPLE }),
    },
    {
      value: ButtonValues.TAGS,
      label: t('{{ buttonValueTags }}', { buttonValueTags: ButtonValues.TAGS }),
    },
  ];

  const onTabClick = (value: ButtonValues) => () => {
    setActiveButton(value);
  };

  // const onNavBack = () => {
  //   history.back();
  // };

  // const searchCount =
  //   searchProfilesState?.length ||
  //   0 + searchBeamsState?.length ||
  //   // 0 + searchReflectionsState?.length ||
  //   0 + searchTagsState?.length ||
  //   0;

  // const allQueriesFinished = React.useMemo(() => {
  //   return (
  //     !searchProfilesReq.isFetching &&
  //     !searchBeamsReq.isFetching &&
  //     !searchCommentsReq.isFetching &&
  //     !searchTagsReq.isFetching
  //   );
  // }, [
  //   searchCommentsReq.isFetching,
  //   searchBeamsReq.isFetching,
  //   searchProfilesReq.isFetching,
  //   searchTagsReq.isFetching,
  // ]);

  const isFetchingSearch = React.useMemo(() => {
    // if (activeButton === ButtonValues.ALL) {
    //   return !allQueriesFinished;
    // }
    return searchKeyword && !searchState[activeButton].done;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState, activeButton /* allQueriesFinished */]);

  const handleTopMenuClick = () => {
    return navigateTo?.({
      appName: '@akashaorg/app-search',
      getNavigationUrl: () => routes[SETTINGS],
    });
  };

  return (
    <Box customStyle="flex(& col)">
      <SearchStartCard
        searchKeyword={searchKeyword}
        handleSearch={handleSearch}
        inputPlaceholderLabel={t('Search')}
        // titleLabel={t('Search')}
        // introLabel={t('✨ Find what you’re looking for quickly ✨')}
        // description={t(
        //   'Search everything. Follow wonderful people. And subscribe to any and all topics that get your synapses firing.',
        // )}
        handleTopMenuClick={handleTopMenuClick}
      >
        <SwitchCard
          activeButton={activeButton}
          onTabClick={onTabClick}
          buttonValues={buttonValues}
          loggedUser={loggedProfileData?.did?.id}
        />
      </SearchStartCard>
      {activeButton === ButtonValues.CONTENT && (
        <SearchAppFilter
          dropdownMenuItems={dropdownMenuItems}
          selected={selected}
          setSelected={setSelected}
          resetLabel={t('Reset')}
        />
      )}
      {searchKeyword === '' && (
        <DefaultEmptyCard noBorder={true} infoText=" ✨ Start searching for something ✨" />
      )}

      {
        /* allQueriesFinished */ !isFetchingSearch &&
          searchKeyword &&
          /* isAllTabActive ? emptySearchState : */ !searchState[activeButton]?.results?.length && (
            <Box customStyle="mt-8">
              <InfoCard
                titleLabel=""
                bodyLabel={
                  <>
                    {t('Oops! Looks like there’re no results for the word ')}{' '}
                    <span className={tw('font-bold')}>{searchKeyword}</span> {t('in ')}{' '}
                    <span className={tw('font-bold')}>{activeButton}</span>.{' '}
                    {t(' Try searching for something else or try a different Category!')}
                  </>
                }
                bodyVariant="body1"
                customWidthStyle="w-[90%] md:w-[50%] m-auto"
              />
            </Box>
          )
      }

      <Box customStyle="mt-4">
        {activeButton === ButtonValues.PEOPLE &&
          searchState[ButtonValues.PEOPLE].done &&
          !!searchProfilesState.length && (
            <>
              {
                <SearchResultCount
                  countLabel={t('Found {{count}} results for {{searchKeyword}} in {{category}}', {
                    count: 0 + searchProfilesState?.length,
                    searchKeyword: searchKeyword,
                    category: activeButton,
                  })}
                />
              }
              {searchProfilesState?.map((profileData: Profile, index: number) => (
                <Box key={index} customStyle="pb-4">
                  <ProfileSearchCard
                    handleFollow={() => handleFollowProfile(profileData.did.id)}
                    handleUnfollow={() => handleUnfollowProfile(profileData.did.id)}
                    isFollowing={followedProfiles.includes(profileData?.did.id)}
                    profileData={profileData}
                    followLabel={t('Follow')}
                    unfollowLabel={t('Unfollow')}
                    descriptionLabel={t('About me')}
                    followingLabel={t('Following')}
                    followersLabel={t('Followers')}
                    shareProfileLabel={t('Share')}
                    profileAnchorLink={'/profile'}
                    onClickProfile={() => handleProfileClick(profileData.did.id)}
                  />
                </Box>
              ))}
            </>
          )}
        {activeButton === ButtonValues.TAGS &&
          searchState[ButtonValues.TAGS].done &&
          !!searchTagsState.length && (
            <>
              {
                <SearchResultCount
                  countLabel={t('Found {{count}} results for {{searchKeyword}} in {{category}}', {
                    count: 0 + searchTagsState?.length,
                    searchKeyword: searchKeyword,
                    category: activeButton,
                  })}
                />
              }
              <Card customStyle="pb-0">
                {searchTagsState?.map((tag: ITag, index: number) => (
                  <Box key={index}>
                    <TagSearchCard
                      tag={tag}
                      subscribedTags={tagSubscriptionsState}
                      subscribeLabel={t('Subscribe')}
                      unsubscribeLabel={t('Unsubscribe')}
                      tagAnchorLink={'/@akashaorg/app-akasha-integration/tags'}
                      onClickTag={() => handleTagClick(tag.name)}
                      handleSubscribeTag={handleTagSubscribe(true)}
                      handleUnsubscribeTag={handleTagSubscribe(false)}
                    />
                    {index < searchTagsState?.length - 1 && <Divider />}
                  </Box>
                ))}
              </Card>
            </>
          )}
        {activeButton === ButtonValues.CONTENT &&
          searchState[ButtonValues.CONTENT].done &&
          !!searchBeamsState.length && (
            <>
              {
                <SearchResultCount
                  countLabel={t('Found {{count}} results for {{searchKeyword}} in {{category}}', {
                    count: 0 + searchBeamsState?.length,
                    searchKeyword: searchKeyword,
                    category: activeButton,
                  })}
                />
              }
              {searchBeamsState?.map(itemData => (
                <EntryCardRenderer
                  key={itemData.itemId}
                  itemData={itemData}
                  itemType={EntityTypes.BEAM}
                  logger={logger}
                  singleSpa={singleSpa}
                  onContentClick={handleEntryNavigation}
                  navigateTo={navigateTo}
                  onRebeam={handleRebeam}
                  onAvatarClick={handleAvatarClick}
                  onMentionClick={handleMentionClick}
                  onTagClick={handleTagClick}
                  contentClickable={true}
                  locale={locale}
                  moderatedContentLabel={t('This content has been moderated')}
                  ctaLabel={t('See it anyway')}
                  uiEvents={uiEvents}
                  navigateToModal={navigateToModal}
                />
              ))}
            </>
          )}
        {/* {(activeButton === ButtonValues.ALL || activeButton === ButtonValues.REPLIES) &&
          searchReflectionsState?.map(itemData => (
            <EntryCardRenderer
              key={itemData.itemId}
              itemData={itemData}
              itemType={EntityTypes.REPLY}
              logger={props.logger}
              singleSpa={singleSpa}
              loggedProfileData={loggedProfileData}
              onContentClick={handleEntryNavigation}
              navigateTo={navigateTo}
              onRepost={handleRebeam}
              onAvatarClick={handleAvatarClick}
              onMentionClick={handleMentionClick}
              onTagClick={handleTagClick}
              contentClickable={true}
              locale={locale}
              moderatedContentLabel={t('This content has been moderated')}
              ctaLabel={t('See it anyway')}
              uiEvents={props.uiEvents}
              navigateToModal={props.navigateToModal}
            />
          ))} */}
      </Box>
      {isFetchingSearch && (
        <Box customStyle="p-8 flex flex-col items-center justify-center m-auto space-y-8">
          <Spinner
            color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
            size="xxl"
            loadingLabel="Loading..."
            partialSpinner={true}
          />
          <Text variant="footnotes2">{t('Searching...')}</Text>
        </Box>
      )}
      {/* triggers intersection observer */}
      <Box customStyle="p-2" ref={loadmoreRef} />
    </Box>
  );
};

export default React.memo(SearchPage);
