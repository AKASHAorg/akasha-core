import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaorg/design-system';
import {
  EntityTypes,
  IProfileData,
  ModalNavigationOptions,
  RootComponentProps,
} from '@akashaorg/typings/ui';
import { useInfiniteCustomPosts, LoginState, useTagSubscriptions } from '@akashaorg/ui-awf-hooks';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';

const { Box, Helmet, StartCard, MyFeedCard } = DS;

export interface MyFeedPageProps {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loggedProfileData?: IProfileData;
  loginState: LoginState;
}

const MyFeedPage: React.FC<MyFeedPageProps & RootComponentProps> = props => {
  const { logger, loggedProfileData, loginState } = props;

  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const isLoggedUser = React.useMemo(() => !!loginState.pubKey, [loginState.pubKey]);

  const { t } = useTranslation('app-akasha-integration');

  const postsReq = useInfiniteCustomPosts(isLoggedUser, 15);
  const tagSubsReq = useTagSubscriptions(loggedProfileData?.ethAddress);

  const navigateToModal = React.useRef(props.navigateToModal);
  const showLoginModal = React.useRef(props.showLoginModal);

  const handleLoadMore = React.useCallback(() => {
    if (!postsReq.isLoading && postsReq.hasNextPage && loginState?.fromCache) {
      postsReq.fetchNextPage();
    }
  }, [postsReq, loginState?.fromCache]);

  /* @Todo: Fix my type */
  const postPages: any = React.useMemo(() => {
    if (postsReq.data) {
      return postsReq.data.pages;
    }
    return [];
  }, [postsReq.data]);

  const userHasSubscriptions = React.useMemo(() => {
    return loggedProfileData?.totalFollowing > 0 || tagSubsReq.data?.length > 0;
  }, [loggedProfileData?.totalFollowing, tagSubsReq.data?.length]);

  const hasPosts = React.useMemo(() => {
    return postPages[0]?.total > 0;
  }, [postPages]);

  const handleEntryFlag = React.useCallback(
    (entryId: string, itemType: string) => () => {
      if (!isLoggedUser) {
        return showLoginModal.current({ modal: { name: 'report-modal', entryId, itemType } });
      }
      navigateToModal.current({ name: 'report-modal', entryId, itemType });
    },
    [isLoggedUser],
  );

  const handleEntryRemove = React.useCallback((entryId: string) => {
    navigateToModal.current({
      name: 'entry-remove-confirmation',
      entryType: EntityTypes.ENTRY,
      entryId,
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
        itemType={EntityTypes.ENTRY}
        pages={postPages}
        onLoadMore={handleLoadMore}
        getShareUrl={(itemId: string) =>
          `${window.location.origin}/@akashaorg/app-akasha-integration/post/${itemId}`
        }
        loginState={loginState}
        navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
        navigateToModal={props.navigateToModal}
        onLoginModalOpen={props.showLoginModal}
        requestStatus={postsReq.status}
        hasNextPage={postsReq.hasNextPage}
        loggedProfile={loggedProfileData}
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
          hasPosts={hasPosts}
        />
      )}
    </Box>
  );
};

export default MyFeedPage;
