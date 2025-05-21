import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  type Tag,
  EntityTypes,
  AnalyticsCategories,
  type Profile,
} from '@akashaorg/typings/lib/ui';
import routes, { SETTINGS } from '../../routes';
import {
  useEntryNavigation,
  useAnalytics,
  useRootComponentProps,
  transformSource,
  useAkashaStore,
} from '@akashaorg/ui-core-hooks';
import EntryCardRenderer from './entry-renderer';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import ProfileSearchCard from '../profile-search-card';
import EmptyCard from '@akashaorg/design-system-components/lib/components/EmptyCard';
import SearchStartCard from '../search-start-card';
import DropDownFilter from '../drop-down-filter';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import SwitchCard from '../switch-card';
import TagSearchCard from '../tag-search-card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { DropdownMenuItemGroupType } from '../base-dropdown-filter';
import SearchResultCount from './search-result-count';
import useIntersectionObserver from '@akashaorg/design-system-core/lib/utils/intersection-observer';
import {
  ErrorLoader,
  ErrorLoaderTitle,
  ErrorLoaderDescription,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
export enum ButtonValues {
  CONTENT = 'Content',
  PEOPLE = 'People',
  TAGS = 'Tags',
}
export type SearchPageProps = {
  searchKeyword?: string;
};

// @TODO to be implemented
type DataResponse = unknown;
const initSearchState = {
  [ButtonValues.CONTENT]: {
    page: 1,
    results: [],
    done: false,
    isLoading: false,
  },
  [ButtonValues.PEOPLE]: {
    page: 1,
    results: [],
    done: false,
    isLoading: false,
  },
  [ButtonValues.TAGS]: {
    page: 1,
    results: [],
    done: false,
    isLoading: false,
  },
};
const SearchPage: React.FC<SearchPageProps> = props => {
  const { searchKeyword } = props;
  const [searchState, setSearchState] = React.useState(initSearchState);
  const [activeButton, setActiveButton] = React.useState<ButtonValues>(ButtonValues.CONTENT);
  const [analyticsActions] = useAnalytics();
  const { t } = useTranslation('app-search');
  const { getCorePlugins, navigateToModal } = useRootComponentProps();
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;
  const showLoginModal = () => {
    navigateToModal({
      name: 'login',
    });
  };

  // @TODO replace with new hooks
  const tagSubscriptionsReq = null;
  const tagSubscriptionsState = tagSubscriptionsReq?.data;
  const toggleTagSubscriptionReq = null;
  const navigateTo = getCorePlugins().routing.navigateTo;
  const handleEntryNavigation = useEntryNavigation(navigateTo);
  const dropDownMenuItems: DropdownMenuItemGroupType[] = [
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
        {
          id: '1',
          title: 'Beams',
        },
        {
          id: '2',
          title: 'Reflection',
        },
      ],
    },
    {
      id: '21',
      title: 'Extensions',
      type: 'optgroup',
      children: [
        {
          id: '4',
          title: 'Apps',
        },
        {
          id: '5',
          title: 'Widgets',
        },
        {
          id: '6',
          title: 'Plugins',
        },
      ],
    },
  ];
  const [selected, setSelected] = React.useState<DropdownMenuItemGroupType | null>(
    dropDownMenuItems[0],
  );
  const updateSearchState = (
    type: ButtonValues,
    data: Array<
      DataResponse & {
        delisted?: boolean;
      }
    >,
  ) => {
    if (!data || !data.length) {
      setSearchState(prevState => ({
        ...prevState,
        [type]: {
          ...prevState[type],
          done: true,
          isLoading: false,
        },
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
    return searchState[tab].results;
  };
  React.useEffect(() => {
    setSearchState({
      ...initSearchState,
      [activeButton]: {
        ...initSearchState[activeButton],
        isLoading: true,
      },
    });
  }, [activeButton, searchKeyword]);

  // @TODO replace with new hooks
  const searchProfilesReq = null;
  const searchProfilesState = getSearchStateForTab(ButtonValues.PEOPLE);
  const searchBeamsState = getSearchStateForTab(ButtonValues.CONTENT);
  const searchTagsReq = null;
  // const searchTagsReq = useSearchTags(decodeURIComponent(searchKeyword));
  const searchTagsState = getSearchStateForTab(ButtonValues.TAGS);
  React.useEffect(() => {
    if (searchProfilesReq?.isFetched) {
      updateSearchState(ButtonValues.PEOPLE, searchProfilesReq?.data);
    }
  }, [searchProfilesReq, searchProfilesReq?.isFetched]);
  React.useEffect(() => {
    if (searchTagsReq?.isFetched) updateSearchState(ButtonValues.TAGS, searchTagsReq.data);
  }, [searchTagsReq, searchTagsReq?.isFetched]);
  const isFollowingMultipleReq = null;
  const followedProfiles = isFollowingMultipleReq?.data;
  const followReq = null;
  const unfollowReq = null;
  const handleTagSubscribe = (subscribe: boolean) => (tagName: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.FILTER_SEARCH,
      action: subscribe ? 'Trending Topic Subscribed' : 'Trending Topic Unsubscribed',
    });
    toggleTagSubscriptionReq.mutate(tagName);
  };
  const handleProfileClick = (id: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${id}`,
    });
  };
  const handleFollowProfile = (id: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.FILTER_SEARCH,
      action: 'Trending People Followed',
    });
    followReq.mutate(id);
  };
  const handleSearch = (inputValue: string) => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;
    const encodedSearchKey = encodeURIComponent(trimmedValue);
    getCorePlugins().routing.navigateTo?.({
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
  const handleMentionClick = (profileDID: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profileDID}`,
    });
  };
  const handleUnfollowProfile = (id: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.FILTER_SEARCH,
      action: 'Trending People Unfollowed',
    });
    unfollowReq.mutate(id);
  };
  const handleTagClick = (name: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-antenna',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${name}`,
    });
  };
  React.useEffect(() => {
    if (activeButton !== ButtonValues.CONTENT) {
      analyticsActions.trackEvent({
        category: AnalyticsCategories.FILTER_SEARCH,
        action: `Filter Search By ${activeButton}`,
      });
    }
  }, [activeButton, analyticsActions]);
  const buttonValues = [
    {
      value: ButtonValues.CONTENT,
      label: t('{{ buttonValueContent }}', {
        buttonValueContent: ButtonValues.CONTENT,
      }),
    },
    {
      value: ButtonValues.PEOPLE,
      label: t('{{ buttonValuePeople }}', {
        buttonValuePeople: ButtonValues.PEOPLE,
      }),
    },
    {
      value: ButtonValues.TAGS,
      label: t('{{ buttonValueTags }}', {
        buttonValueTags: ButtonValues.TAGS,
      }),
    },
  ];
  const onTabClick = (value: ButtonValues) => () => {
    setActiveButton(value);
  };
  const isFetchingSearch = React.useMemo(() => {
    return searchKeyword && !searchState[activeButton].done;
  }, [searchKeyword, searchState, activeButton]);
  const handleTopMenuClick = () => {
    return navigateTo?.({
      appName: '@akashaorg/app-search',
      getNavigationUrl: () => routes[SETTINGS],
    });
  };
  const handleResetClick = () => {
    setSelected(dropDownMenuItems[0]);
  };
  return (
    <Card className="p-4 rounded-[1.25rem]">
      <Stack>
        <SearchStartCard
          searchKeyword={searchKeyword}
          handleSearch={handleSearch}
          titleLabel={t('Search')}
          inputPlaceholderLabel={t('Search')}
          handleTopMenuClick={handleTopMenuClick}
        >
          <SwitchCard
            activeButton={activeButton}
            onTabClick={onTabClick}
            buttonValues={buttonValues}
            isLoggedIn={isLoggedIn}
          />
        </SearchStartCard>

        {activeButton === ButtonValues.CONTENT && (
          <DropDownFilter
            dropdownMenuItems={dropDownMenuItems}
            selected={selected}
            setSelected={setSelected}
            resetLabel={t('Reset')}
            resetHandler={handleResetClick}
          />
        )}

        {searchKeyword === '' && (
          <EmptyCard
            infoText=" ✨ Start searching for something ✨"
            assetName="search-1"
          />
        )}

        {!isFetchingSearch && searchKeyword && !searchState[activeButton]?.results?.length && (
          <Stack customStyle="mt-8">
            <ErrorLoader type="list-not-available">
              <ErrorLoaderTitle>
                <>
                  {t('Oops! Looks like there’re no results for the word')}{' '}
                  <Typography bold>{searchKeyword}</Typography> {t('in')}{' '}
                  <Typography bold>{activeButton}</Typography>.{' '}
                </>
              </ErrorLoaderTitle>
              <ErrorLoaderDescription>
                {t('Try searching for something else or try a different Category!')}
              </ErrorLoaderDescription>
            </ErrorLoader>
          </Stack>
        )}

        <Stack customStyle="mt-4">
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
                  <Stack key={index} customStyle="pb-4">
                    <ProfileSearchCard
                      handleFollow={() => handleFollowProfile(profileData?.did?.id)}
                      handleUnfollow={() => handleUnfollowProfile(profileData?.did?.id)}
                      isFollowing={followedProfiles.includes(profileData?.did?.id)}
                      profileData={profileData}
                      followLabel={t('Follow')}
                      unfollowLabel={t('Unfollow')}
                      descriptionLabel={t('About me')}
                      followingLabel={t('Following')}
                      followersLabel={t('Followers')}
                      shareProfileLabel={t('Share')}
                      onClickProfile={() => handleProfileClick(profileData?.did?.id)}
                      transformSource={transformSource}
                    />
                  </Stack>
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
                <Card className="pb-0">
                  {searchTagsState?.map((tag: Tag, index: number) => (
                    <Stack key={index}>
                      <TagSearchCard
                        tag={tag}
                        subscribedTags={tagSubscriptionsState}
                        subscribeLabel={t('Subscribe')}
                        unsubscribeLabel={t('Unsubscribe')}
                        tagAnchorLink={'/@akashaorg/app-antenna/tags'}
                        onClickTag={() => handleTagClick(tag.name)}
                        handleSubscribeTag={handleTagSubscribe(true)}
                        handleUnsubscribeTag={handleTagSubscribe(false)}
                      />
                      {index < searchTagsState?.length - 1 && <Separator />}
                    </Stack>
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
                    onContentClick={handleEntryNavigation}
                    navigateTo={navigateTo}
                    onAvatarClick={handleAvatarClick}
                    onMentionClick={handleMentionClick}
                    onTagClick={handleTagClick}
                    contentClickable={true}
                    moderatedContentLabel={t('This content has been moderated')}
                    ctaLabel={t('See it anyway')}
                  />
                ))}
              </>
            )}
        </Stack>
        {isFetchingSearch && (
          <Stack align="center" justify="center" spacing="gap-y-8" customStyle="p-8 m-auto">
            <Spinner
              color={{
                light: 'secondaryLight',
                dark: 'secondaryDark',
              }}
              size="xxl"
              loadingLabel="Loading..."
              partialSpinner={true}
            />
            <Typography variant="xs" className="font-medium">
              {t('Searching...')}
            </Typography>
          </Stack>
        )}
        {/* triggers intersection observer */}
        <Stack padding="p-2" ref={loadmoreRef} />
      </Stack>
    </Card>
  );
};
export default React.memo(SearchPage);
