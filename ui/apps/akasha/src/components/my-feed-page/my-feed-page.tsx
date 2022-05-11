import * as React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import { useInfiniteCustomPosts, LoginState, useTagSubscriptions } from '@akashaorg/ui-awf-hooks';

import { ModalNavigationOptions } from '@akashaorg/ui-awf-typings/lib/app-loader';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';

import { IProfileData } from '@akashaorg/ui-awf-typings/lib/profile';
import { ItemTypes } from '@akashaorg/ui-awf-typings/lib/app-loader';

const { Box, Helmet, StartCard, MyFeedCard, Spinner } = DS;

export interface MyFeedPageProps {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loggedProfileData?: IProfileData;
  loginState: LoginState;
}

const MyFeedPage: React.FC<MyFeedPageProps & RootComponentProps> = props => {
  const { logger, loggedProfileData, loginState } = props;

  const navigateTo = props.plugins?.routing?.navigateTo;

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

  const postPages = React.useMemo(() => {
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
      entryType: ItemTypes.ENTRY,
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

      <Box margin={{ bottom: 'medium' }} gap="medium">
        <StartCard
          title={t('My Feed')}
          heading={t('✨ Add a little magic to your feed ✨')}
          description={t(
            'To create your unique feed view, subscribe to your favourite topics and find wonderful people to follow in our community. ',
          )}
          secondaryDescription={t('Here’s your unique view to Ethereum World')}
          image="/images/news-feed.png"
          showMainArea={!userHasSubscriptions}
          hideMainAreaOnMobile={false}
          showSecondaryArea={userHasSubscriptions}
          CTALabel={t('Customize My Feed')}
          onClickCTA={handleCTAClick}
        />
      </Box>

      {postsReq.isFetching && (
        <Box>
          <Spinner />
        </Box>
      )}

      <FeedWidget
        modalSlotId={props.layoutConfig.modalSlotId}
        logger={logger}
        itemType={ItemTypes.ENTRY}
        pages={postPages}
        onLoadMore={handleLoadMore}
        getShareUrl={(itemId: string) => `${window.location.origin}/social-app/post/${itemId}`}
        loginState={loginState}
        navigateTo={props.plugins?.routing?.navigateTo}
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
        i18n={props.plugins?.translation?.i18n}
        accentBorderTop={true}
      />

      {userHasSubscriptions && !postsReq.isFetching && (
        <MyFeedCard
          title={t('✨ Add a little magic to your feed ✨')}
          description={t('You can follow more topics and people to make your feed more “You”. ')}
          noPostsTitle={t('No Posts Yet')}
          noPostsDescription={t(
            'Once you start following people or topics with published posts, they will be found here.',
          )}
          CTALabel={t('Find topics & people')}
          onClickCTA={handleCTAClick}
          hasPosts={hasPosts}
        />
      )}
    </Box>
  );
};

export default MyFeedPage;
