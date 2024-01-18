import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import StartCard from '@akashaorg/design-system-components/lib/components/StartCard';
import { useTranslation } from 'react-i18next';
import { ModalNavigationOptions, Profile } from '@akashaorg/typings/lib/ui';
import { useGetInterestsByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { BeamContentResolver, BeamFeed } from '@akashaorg/ui-lib-feed';

export type MyFeedPageProps = {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  authenticatedProfile?: Profile;
};
const MY_ANTENNA_OVERSCAN = 10;

const MyFeedPage: React.FC<MyFeedPageProps> = props => {
  const { authenticatedProfile, showLoginModal } = props;
  const { getRoutingPlugin } = useRootComponentProps();
  const navigateTo = React.useRef(getRoutingPlugin().navigateTo);
  const { t } = useTranslation('app-akasha-integration');

  const isLoggedUser = React.useMemo(() => !!authenticatedProfile?.did.id, [authenticatedProfile]);

  const { data: tagSubsReq } = useGetInterestsByDidQuery({
    variables: { id: authenticatedProfile?.did.id },
  });
  const tagSubsData =
    tagSubsReq?.node && hasOwn(tagSubsReq.node, 'akashaProfileInterests')
      ? tagSubsReq.node.akashaProfileInterests
      : null;
  const userHasSubscriptions = React.useMemo(() => {
    return authenticatedProfile?.followers?.edges?.length > 0 || tagSubsData?.topics?.length > 0;
  }, [authenticatedProfile, tagSubsData]);

  const handleCTAClick = () => {
    if (!isLoggedUser) {
      return showLoginModal();
    }
    navigateTo.current?.({
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
      <BeamFeed
        queryKey={'app-akasha-integration_my-antenna'}
        estimatedHeight={150}
        itemSpacing={8}
        scrollerOptions={{ overscan: MY_ANTENNA_OVERSCAN }}
        scrollTopIndicator={(listRect, onScrollToTop) => (
          <ScrollTopWrapper placement={listRect.left}>
            <ScrollTopButton hide={false} onClick={onScrollToTop} />
          </ScrollTopWrapper>
        )}
        renderItem={itemData => {
          if (!hasOwn(itemData.node, 'content'))
            return <BeamContentResolver beamId={itemData.node.beamID} />;
        }}
      />
    </Stack>
  );
};

export default MyFeedPage;
