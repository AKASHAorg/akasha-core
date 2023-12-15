import React from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BackToOriginalBeam from '@akashaorg/ui-lib-feed/lib/components/back-to-orignal-beam';
import EntrySectionLoading from './entry-section-loading';
import ReflectionSection from './reflection-section';
import { useParams } from 'react-router-dom';
import {
  hasOwn,
  mapReflectEntryData,
  useAnalytics,
  useEntryNavigation,
  useGetLoginProfile,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import { PendingReflect } from './pending-reflect';
import ReflectFeed from '@akashaorg/ui-lib-feed/lib/components/reflect-feed';
import { ReflectionCard } from '@akashaorg/ui-lib-feed';
import { useGetReflectionByIdSuspenseQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

const ReflectionPage: React.FC<unknown> = () => {
  const { reflectionId } = useParams<{
    reflectionId: string;
  }>();
  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin, navigateToModal, getTranslationPlugin } = useRootComponentProps();
  const reflectionReq = useGetReflectionByIdSuspenseQuery({ variables: { id: reflectionId } });
  const profileDataReq = useGetLoginProfile();

  const [analyticsActions] = useAnalytics();

  const entryData = React.useMemo(() => {
    if (
      reflectionReq.data &&
      hasOwn(reflectionReq.data, 'node') &&
      hasOwn(reflectionReq.data.node, 'id')
    ) {
      return reflectionReq.data.node;
    }
  }, [reflectionReq]);

  const showLoginModal = () => {
    navigateToModal({ name: 'login' });
  };

  const onNavigate = useEntryNavigation(getRoutingPlugin().navigateTo);

  if (reflectionReq.error)
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading the entry')}
        details={t('We cannot show this entry right now')}
        devDetails={reflectionReq.error.message}
      />
    );

  return (
    <Card padding="p-0" margin="mb-4">
      <BackToOriginalBeam
        label={t('Back to original beam')}
        onClick={() =>
          onNavigate({ authorId: entryData?.author?.id, id: entryData.beam?.id }, EntityTypes.BEAM)
        }
      />
      <React.Suspense fallback={<EntrySectionLoading />}>
        <ReflectionSection
          beamId={entryData.beam?.id}
          reflectionId={entryData.id}
          entryData={mapReflectEntryData(entryData)}
          isLoggedIn={!!profileDataReq?.akashaProfile?.id}
          onNavigate={onNavigate}
          showLoginModal={showLoginModal}
        />
      </React.Suspense>
      <PendingReflect beamId={entryData.beam?.id} authorId={profileDataReq?.akashaProfile?.id} />
      <Stack spacing="gap-y-2">
        <ReflectFeed
          reflectionsOf={{ entryId: entryData.id, itemType: EntityTypes.REFLECT }}
          itemSpacing={0}
          newItemsPublishedLabel={t('New Reflects published recently')}
          trackEvent={analyticsActions.trackEvent}
          locale={getTranslationPlugin().i18n.language}
          estimatedHeight={120}
          queryKey={`reflect-feed-${entryData.id}`}
          renderItem={itemData => (
            <ReflectionCard
              entryData={mapReflectEntryData(itemData.node)}
              contentClickable={true}
              onContentClick={() =>
                getRoutingPlugin().navigateTo({
                  appName: '@akashaorg/app-akasha-integration',
                  getNavigationUrl: navRoutes => `${navRoutes.Reflect}/${itemData.node.id}`,
                })
              }
              onReflect={() =>
                getRoutingPlugin().navigateTo({
                  appName: '@akashaorg/app-akasha-integration',
                  getNavigationUrl: navRoutes =>
                    `${navRoutes.Reflect}/${itemData.node.id}/${navRoutes.Reflect}`,
                })
              }
            />
          )}
        />
      </Stack>
    </Card>
  );
};

export default ReflectionPage;
