import React, { useMemo, useRef } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import StartCard from '@akashaorg/design-system-components/lib/components/StartCard';
import { useTranslation } from 'react-i18next';
import { IModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import { useGetInterestsByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import {
  hasOwn,
  useAkashaStore,
  useNsfwToggling,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { BeamContentResolver, getNsfwFiltersForTagFeed, TagFeed } from '@akashaorg/ui-lib-feed';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AkashaIndexedStreamStreamType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import getSDK from '@akashaorg/awf-sdk';

const MY_ANTENNA_OVERSCAN = 10;

const MyAntennaPage: React.FC<unknown> = () => {
  const { t } = useTranslation('app-antenna');
  const { getRoutingPlugin, navigateToModal, worldConfig } = useRootComponentProps();
  const { showNsfw } = useNsfwToggling();
  const {
    data: { authenticatedProfile },
  } = useAkashaStore();
  const navigateTo = React.useRef(getRoutingPlugin().navigateTo);
  const _navigateToModal = React.useRef(navigateToModal);
  const showLoginModal = React.useCallback(
    (redirectTo?: { modal: IModalNavigationOptions }, message?: string) => {
      _navigateToModal.current?.({
        name: 'login',
        redirectTo,
        title: t('Member Only Feature'),
        message: message ?? t('You need to connect first to be able to use this feature.'),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const isLoggedUser = React.useMemo(() => !!authenticatedProfile?.did.id, [authenticatedProfile]);
  const { data: tagSubsReq } = useGetInterestsByDidQuery({
    variables: { id: authenticatedProfile?.did.id },
    skip: !authenticatedProfile?.did.id,
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
  const sdk = useRef(getSDK());
  const tagFilters = useMemo(
    () => [
      { where: { streamType: { equalTo: AkashaIndexedStreamStreamType.Beam } } },
      { where: { indexType: { equalTo: sdk.current.services.gql.labelTypes.TAG } } },
      { where: { active: { equalTo: true } } },
    ],
    [],
  );

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
            dataTestId="tag-feed"
            estimatedHeight={150}
            itemSpacing={8}
            filters={{
              and: [
                ...tagFilters,
                {
                  or: [
                    ...getNsfwFiltersForTagFeed({
                      showNsfw,
                      isLoggedIn: !!authenticatedProfile?.did.id,
                    }),
                    { where: { indexValue: { in: tagSubsData.topics.map(t => t.value) } } },
                  ],
                },
              ],
            }}
            tags={tagSubsData?.topics.map(topic => topic.value)}
            scrollOptions={{ overScan: MY_ANTENNA_OVERSCAN }}
            scrollTopIndicator={(listRect, onScrollToTop) => (
              <ScrollTopWrapper placement={listRect.left}>
                <ScrollTopButton hide={false} onClick={onScrollToTop} />
              </ScrollTopWrapper>
            )}
            renderItem={itemData => <BeamContentResolver beamId={itemData.stream} />}
          />
        )}
      </Stack>
    </HelmetProvider>
  );
};

export default MyAntennaPage;
