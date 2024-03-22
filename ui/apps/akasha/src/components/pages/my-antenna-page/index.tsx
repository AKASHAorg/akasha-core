import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import StartCard from '@akashaorg/design-system-components/lib/components/StartCard';
import { useTranslation } from 'react-i18next';
import { ModalNavigationOptions, Profile } from '@akashaorg/typings/lib/ui';
import { useGetInterestsByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { hasOwn, useGetLoginProfile, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { BeamContentResolver, TagFeed } from '@akashaorg/ui-lib-feed';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const MY_ANTENNA_OVERSCAN = 10;

const MyAntennaPage: React.FC<unknown> = () => {
  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin, navigateToModal, worldConfig } = useRootComponentProps();
  const authenticatedProfileReq = useGetLoginProfile();
  const authenticatedProfile: Profile = authenticatedProfileReq?.akashaProfile;
  const navigateTo = React.useRef(getRoutingPlugin().navigateTo);
  const _navigateToModal = React.useRef(navigateToModal);
  const showLoginModal = React.useCallback(
    (redirectTo?: { modal: ModalNavigationOptions }, message?: string) => {
      _navigateToModal.current?.({
        name: 'login',
        redirectTo,
        message,
      });
    },
    [],
  );
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
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes =>
        `${navRoutes.rootRoute}/${authenticatedProfile?.did.id}${navRoutes.interests}`,
    });
  };

  return (
    <HelmetProvider>
      <Stack fullWidth={true}>
        <Helmet>
          <title>{worldConfig.title}</title>
        </Helmet>
        <Stack customStyle="mb-2">
          <StartCard
            heading={t('Add some magic to your feed 🪄')}
            description={t(
              `Personalize your antenna! Pick favorite topics, and enjoy beams tailored to your interests. Don't miss a thing!`,
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
        {userHasSubscriptions && (
          <TagFeed
            queryKey={'antenna_my-antenna'}
            estimatedHeight={150}
            itemSpacing={8}
            tags={tagSubsData?.topics.map(topic => topic.value)}
            scrollerOptions={{ overscan: MY_ANTENNA_OVERSCAN }}
            scrollTopIndicator={(listRect, onScrollToTop) => (
              <ScrollTopWrapper placement={listRect.left}>
                <ScrollTopButton hide={false} onClick={onScrollToTop} />
              </ScrollTopWrapper>
            )}
            renderItem={itemData => <BeamContentResolver beamId={itemData.node.stream} />}
          />
        )}
      </Stack>
    </HelmetProvider>
  );
};

export default MyAntennaPage;
