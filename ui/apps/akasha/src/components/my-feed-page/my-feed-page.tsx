import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { EntityTypes, ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';
import { Profile } from '@akashaorg/typings/lib/ui';
import {
  useGetInterestsByDidQuery,
  useInfiniteGetBeamsQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import StartCard from '@akashaorg/design-system-components/lib/components/StartCard';
import MyFeedCard from '@akashaorg/design-system-components/lib/components/MyFeedCard';
import { useEntryNavigation, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

export type MyFeedPageProps = {
  showModal: (name: string, modalData?: Record<string, unknown>) => void;
  loggedProfileData?: Profile;
};

const MyFeedPage: React.FC<MyFeedPageProps> = props => {
  const { loggedProfileData, showModal } = props;
  const { getRoutingPlugin } = useRootComponentProps();
  const navigateTo = getRoutingPlugin().navigateTo;
  const { t } = useTranslation('app-akasha-integration');

  const isLoggedUser = React.useMemo(() => !!loggedProfileData?.did.id, [loggedProfileData]);

  const postsReq = useInfiniteGetBeamsQuery('last', { last: 15 });
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

  const userHasSubscriptions = React.useMemo(() => {
    return loggedProfileData?.followers?.edges?.length > 0 || tagSubsReq.data?.topics?.length > 0;
  }, [loggedProfileData, tagSubsReq.data]);

  const showLoginModal = React.useCallback(
    (modalData?: Record<string, unknown>) => {
      showModal('login', modalData);
    },
    [showModal],
  );

  const handleEntryFlag = React.useCallback(
    (itemId: string, itemType: EntityTypes) => () => {
      if (!isLoggedUser) {
        return showLoginModal({
          redirectTo: { modal: { name: 'report-modal', itemId, itemType } },
        });
      }
      showModal('report-modal', { itemId, itemType });
    },
    [isLoggedUser, showLoginModal, showModal],
  );

  const handleEntryRemove = React.useCallback(
    (itemId: string) => {
      showModal('entry-remove-confirmation', {
        itemType: EntityTypes.BEAM,
        itemId,
      });
    },
    [showModal],
  );

  const handleCTAClick = () => {
    if (!isLoggedUser) {
      return showLoginModal;
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

      <FeedWidget
        queryKey="akasha-my-feed-query"
        itemType={EntityTypes.BEAM}
        onLoginModalOpen={showLoginModal}
        loggedProfileData={loggedProfileData}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        onEntryRemove={handleEntryRemove}
        itemSpacing={8}
        accentBorderTop={true}
        onNavigate={useEntryNavigation(getRoutingPlugin().navigateTo)}
        newItemsPublishedLabel={t('New Beams published recently')}
      />

      {userHasSubscriptions && !postsReq.isFetching && (
        <MyFeedCard
          title={t('✨ Add a little magic to your feed ✨')}
          description={t(
            'Follow topics and wonderful people you care about most to feel at home every time you visit AKASHA World. ',
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
    </Stack>
  );
};

export default MyFeedPage;
