import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaorg/design-system';
import {
  EntityTypes,
  IEntryPage,
  IProfileData,
  ModalNavigationOptions,
  RootComponentProps,
} from '@akashaorg/typings/ui';
import { useInfiniteCustomPosts, LoginState, useTagSubscriptions } from '@akashaorg/ui-awf-hooks';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';
import { Profile } from '@akashaorg/typings/ui';
import {
  useGetFollowingListByDidQuery,
  useGetInterestsByDidQuery,
  useGetPostsQuery,
  useInfiniteGetPostsQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

const { Box, Helmet, StartCard, MyFeedCard } = DS;

export interface MyFeedPageProps {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loggedProfileData?: Profile;
}

const MyFeedPage: React.FC<MyFeedPageProps & RootComponentProps> = props => {
  const { logger, loggedProfileData } = props;

  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const isLoggedUser = React.useMemo(() => !!loggedProfileData?.did.id, [loggedProfileData]);

  const { t } = useTranslation('app-akasha-integration');

  const postsReq = useInfiniteGetPostsQuery('last', { last: 15 });
  const tagSubsReq = useGetInterestsByDidQuery(
    { id: loggedProfileData?.did.id },
    {
      select: data => {
        if (data?.node) {
          if ('interests' in data.node) {
            return data.node.interests;
          }
        }
        return null;
      },
    },
  );
  const followingReq = useGetFollowingListByDidQuery({ id: loggedProfileData?.did.id });
  const navigateToModal = React.useRef(props.navigateToModal);
  const showLoginModal = React.useRef(props.showLoginModal);

  const handleLoadMore = React.useCallback(() => {
    if (!postsReq.isLoading && postsReq.hasNextPage) {
      postsReq.fetchNextPage();
    }
  }, [postsReq]);

  const postPages = React.useMemo(() => {
    if (postsReq.data) {
      return postsReq.data.pages;
    }
    return [];
  }, [postsReq.data]);

  const userHasSubscriptions = React.useMemo(() => {
    return loggedProfileData?.followers.edges.length > 0 || tagSubsReq.data?.topics.length > 0;
  }, [followingReq.data, tagSubsReq.data]);

  const handleEntryFlag = React.useCallback(
    (itemId: string, itemType: EntityTypes) => () => {
      if (!isLoggedUser) {
        return showLoginModal.current({ modal: { name: 'report-modal', itemId, itemType } });
      }
      navigateToModal.current({ name: 'report-modal', itemId, itemType });
    },
    [isLoggedUser],
  );

  const handleEntryRemove = React.useCallback((itemId: string) => {
    navigateToModal.current({
      name: 'entry-remove-confirmation',
      itemType: EntityTypes.POST,
      itemId,
    });
  }, []);

  const handleCTAClick = () => {
    if (!isLoggedUser) {
      return showLoginModal.current();
    }
    navigateTo?.({
      appName: '@akashaorg/app-search',
      getNavigationUrl: navRoutes => `${navRoutes.Onboarding}`,
    });
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Ethereum World</title>
      </Helmet>

      <Box margin={{ bottom: 'small' }}>
        <StartCard
          title={t('My Feed')}
          heading={t('Add some magic to your feed 🪄')}
          description={t(
            'To create your unique feed view, subscribe to your favourite topics and find wonderful people to follow in our community. ',
          )}
          secondaryDescription={t('Your customized view of Ethereum World')}
          image="/images/news-feed.webp"
          showMainArea={!userHasSubscriptions}
          hideMainAreaOnMobile={false}
          showSecondaryArea={userHasSubscriptions}
          CTALabel={t('Customize My Feed')}
          onClickCTA={handleCTAClick}
        />
      </Box>

      <FeedWidget
        modalSlotId={props.layoutConfig.modalSlotId}
        logger={logger}
        itemType={EntityTypes.POST}
        pages={postPages as IEntryPage[]}
        onLoadMore={handleLoadMore}
        getShareUrl={(itemId: string) =>
          `${window.location.origin}/@akashaorg/app-akasha-integration/post/${itemId}`
        }
        navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
        navigateToModal={props.navigateToModal}
        onLoginModalOpen={props.showLoginModal}
        requestStatus={postsReq.status}
        hasNextPage={postsReq.hasNextPage}
        loggedProfileData={loggedProfileData}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        onEntryRemove={handleEntryRemove}
        removeEntryLabel={t('Delete Post')}
        removedByMeLabel={t('You deleted this post')}
        removedByAuthorLabel={t('This post was deleted by its author')}
        uiEvents={props.uiEvents}
        itemSpacing={8}
        i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}
        accentBorderTop={true}
      />

      {userHasSubscriptions && !postsReq.isFetching && (
        <MyFeedCard
          title={t('✨ Add a little magic to your feed ✨')}
          description={t(
            'Follow topics and wonderful people you care about most to feel at home every time you visit Ethereum World. ',
          )}
          noPostsTitle={t('No Posts Yet')}
          noPostsDescription={t(
            'Once you start following people or topics with published posts, they will be found here.',
          )}
          CTALabel={t('Find topics and people')}
          onClickCTA={handleCTAClick}
          hasPosts={postsReq.hasNextPage && postsReq.data?.pages.length > 0}
        />
      )}
    </Box>
  );
};

export default MyFeedPage;
