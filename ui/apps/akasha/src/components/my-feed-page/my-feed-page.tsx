import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { EntityTypes, ModalNavigationOptions, RootComponentProps } from '@akashaorg/typings/ui';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';
import { Profile } from '@akashaorg/typings/ui';
import {
  useGetFollowingListByDidQuery,
  useGetInterestsByDidQuery,
  useInfiniteGetBeamsQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import StartCard from '@akashaorg/design-system-components/lib/components/StartCard';
import MyFeedCard from '@akashaorg/design-system-components/lib/components/MyFeedCard';

export interface MyFeedPageProps {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loggedProfileData?: Profile;
}

const MyFeedPage: React.FC<MyFeedPageProps & RootComponentProps> = props => {
  const { logger, loggedProfileData, layoutConfig, plugins, uiEvents } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const isLoggedUser = React.useMemo(() => !!loggedProfileData?.did.id, [loggedProfileData]);

  const { t } = useTranslation('app-akasha-integration');

  const postsReq = useInfiniteGetBeamsQuery('last', { last: 15 });
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
    return loggedProfileData?.followers?.edges?.length > 0 || tagSubsReq.data?.topics?.length > 0;
  }, [loggedProfileData, tagSubsReq.data]);

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
    <Box customStyle="w-full">
      <Helmet.Helmet>
        <title>Akasha World</title>
      </Helmet.Helmet>

      <Box customStyle="mb-2">
        <StartCard
          title={t('My Feed')}
          heading={t('Add some magic to your feed 🪄')}
          description={t(
            'To create your unique feed view, subscribe to your favourite topics and find wonderful people to follow in our community. ',
          )}
          secondaryDescription={t('Your customized view of Akasha World')}
          image="/images/news-feed.webp"
          showMainArea={!userHasSubscriptions}
          hideMainAreaOnMobile={false}
          showSecondaryArea={userHasSubscriptions}
          CTALabel={t('Customize My Feed')}
          onClickCTA={handleCTAClick}
        />
      </Box>

      <FeedWidget
        modalSlotId={layoutConfig.modalSlotId}
        logger={logger}
        itemType={EntityTypes.POST}
        pages={[]}
        onLoadMore={handleLoadMore}
        navigateTo={plugins['@akashaorg/app-routing']?.routing?.navigateTo}
        navigateToModal={navigateToModal.current}
        onLoginModalOpen={showLoginModal.current}
        requestStatus={null}
        hasNextPage={false}
        loggedProfileData={loggedProfileData}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        onEntryRemove={handleEntryRemove}
        removeEntryLabel={t('Delete Post')}
        removedByMeLabel={t('You deleted this post')}
        removedByAuthorLabel={t('This post was deleted by its author')}
        uiEvents={uiEvents}
        itemSpacing={8}
        i18n={plugins['@akashaorg/app-translation']?.translation?.i18n}
        accentBorderTop={true}
      />

      {userHasSubscriptions && !postsReq.isFetching && (
        <MyFeedCard
          title={t('✨ Add a little magic to your feed ✨')}
          description={t(
            'Follow topics and wonderful people you care about most to feel at home every time you visit Akasha World. ',
          )}
          noPostsTitle={t('No Posts Yet')}
          noPostsDescription={t(
            'Once you start following people or topics with published posts, they will be found here.',
          )}
          CTALabel={t('Find topics and people')}
          onClickCTA={handleCTAClick}
          hasPosts={postsReq.hasNextPage && postsReq.data?.pages?.length > 0}
        />
      )}
    </Box>
  );
};

export default MyFeedPage;
