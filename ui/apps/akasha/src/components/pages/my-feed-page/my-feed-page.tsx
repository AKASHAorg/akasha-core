import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { EntityTypes, ModalNavigationOptions, Profile } from '@akashaorg/typings/lib/ui';
import { useGetInterestsByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import BeamCard from '@akashaorg/ui-lib-feed/lib/components/cards/beam-card';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import MyFeedCard from '@akashaorg/design-system-components/lib/components/MyFeedCard';
import StartCard from '@akashaorg/design-system-components/lib/components/StartCard';
import BeamFeed from '@akashaorg/ui-lib-feed/lib/components/beam-feed';

export type MyFeedPageProps = {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loggedProfileData?: Profile;
};
const MY_ANTENNA_OVERSCAN = 10;

const MyFeedPage: React.FC<MyFeedPageProps> = props => {
  const { loggedProfileData, showLoginModal } = props;
  const { getRoutingPlugin, navigateToModal } = useRootComponentProps();
  const navigateTo = getRoutingPlugin().navigateTo;
  const { t } = useTranslation('app-akasha-integration');

  const isLoggedUser = React.useMemo(() => !!loggedProfileData?.did.id, [loggedProfileData]);

  // const postsReq = useInfiniteGetBeamsQuery('last', { last: 15 });
  // const db = React.useMemo(() => {
  //   return new ScrollStateDBWrapper('scroll-state');
  // }, []);

  const tagSubsReq = useGetInterestsByDidQuery(
    { id: loggedProfileData?.did.id },
    {
      select: data => {
        if (data?.node) {
          if ('akashaProfileInterests' in data.node) {
            return data.node.akashaProfileInterests;
          }
        }
        return null;
      },
    },
  );
  const _navigateToModal = React.useRef(navigateToModal);
  const userHasSubscriptions = React.useMemo(() => {
    return loggedProfileData?.followers?.edges?.length > 0 || tagSubsReq.data?.topics?.length > 0;
  }, [loggedProfileData, tagSubsReq.data]);

  const handleEntryFlag = React.useCallback(
    (itemId: string, itemType: EntityTypes) => () => {
      if (!isLoggedUser) {
        return showLoginModal({ modal: { name: 'report-modal', itemId, itemType } });
      }
      _navigateToModal.current?.({ name: 'report-modal', itemId, itemType });
    },
    [isLoggedUser, showLoginModal],
  );

  const handleEntryRemove = React.useCallback((itemId: string) => {
    _navigateToModal.current({
      name: 'entry-remove-confirmation',
      itemType: EntityTypes.BEAM,
      itemId,
    });
  }, []);

  const handleCTAClick = () => {
    if (!isLoggedUser) {
      return showLoginModal();
    }
    navigateTo?.({
      appName: '@akashaorg/app-search',
      getNavigationUrl: navRoutes => `${navRoutes.Onboarding}`,
    });
  };
  return (
    <Stack fullWidth={true}>
      <Helmet.Helmet>
        <title>AKASHA World</title>
      </Helmet.Helmet>
      <BeamFeed
        header={
          <Stack customStyle="mb-2">
            <StartCard
              title={t('My Feed')}
              heading={t('Add some magic to your feed 🪄')}
              description={t(
                'To create your unique feed view, subscribe to your favourite topics and find wonderful people to follow in our community. ',
              )}
              secondaryDescription={t('Your customized view of AKASHA World')}
              image="/images/news-feed.webp"
              showMainArea={!userHasSubscriptions}
              hideMainAreaOnMobile={false}
              showSecondaryArea={userHasSubscriptions}
              CTALabel={t('Customize My Feed')}
              onClickCTA={handleCTAClick}
            />
          </Stack>
        }
        queryKey={'app-akasha-integration_my-antenna'}
        estimatedHeight={150}
        itemSpacing={8}
        scrollerOptions={{ overscan: MY_ANTENNA_OVERSCAN }}
        scrollTopIndicator={(listRect, onScrollToTop) => (
          <ScrollTopWrapper placement={listRect.left}>
            <ScrollTopButton hide={false} onClick={onScrollToTop} />
          </ScrollTopWrapper>
        )}
        renderItem={itemData => (
          <BeamCard
            entryData={itemData.node}
            contentClickable={true}
            onContentClick={() =>
              navigateTo({
                appName: '@akashaorg/app-akasha-integration',
                getNavigationUrl: navRoutes => `${navRoutes.Beam}/${itemData.node.id}`,
              })
            }
          />
        )}
      />

      {/*{userHasSubscriptions && !postsReq.isFetching && (*/}
      {/*  <MyFeedCard*/}
      {/*    title={t('✨ Add a little magic to your feed ✨')}*/}
      {/*    description={t(*/}
      {/*      'Follow topics and wonderful people you care about most to feel at home every time you visit AKASHA World. ',*/}
      {/*    )}*/}
      {/*    noPostsTitle={t('No Posts Yet')}*/}
      {/*    noPostsDescription={t(*/}
      {/*      'Once you start following people or topics with published posts, they will be found here.',*/}
      {/*    )}*/}
      {/*    CTALabel={t('Find topics and people')}*/}
      {/*    onClickCTA={handleCTAClick}*/}
      {/*    hasPosts={postsReq.hasNextPage && postsReq.data?.pages?.length > 0}*/}
      {/*  />*/}
      {/*)}*/}
    </Stack>
  );
};

export default MyFeedPage;
