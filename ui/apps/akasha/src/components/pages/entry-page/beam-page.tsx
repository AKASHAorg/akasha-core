import React from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EntrySectionLoading from './entry-section-loading';
import BeamSection from './beam-section';
import { useParams } from 'react-router-dom';
import {
  hasOwn,
  useAnalytics,
  useEntryNavigation,
  useGetLoginProfile,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import { PendingReflect } from './pending-reflect';
import { ReflectFeed, ReflectionCard, ReflectionPreview } from '@akashaorg/ui-lib-feed';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { useGetBeamByIdSuspenseQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

const BeamPage: React.FC<unknown> = () => {
  const { beamId } = useParams<{
    beamId: string;
  }>();
  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin, navigateToModal, getTranslationPlugin } = useRootComponentProps();
  const beamReq = useGetBeamByIdSuspenseQuery({ variables: { id: beamId } });
  const profileDataReq = useGetLoginProfile();
  const [analyticsActions] = useAnalytics();

  const entryData = React.useMemo(() => {
    if (beamReq.data && hasOwn(beamReq.data, 'node') && hasOwn(beamReq.data.node, 'id')) {
      return beamReq.data.node;
    }
  }, [beamReq]);

  const showLoginModal = () => {
    navigateToModal({ name: 'login' });
  };

  const onNavigate = useEntryNavigation(getRoutingPlugin().navigateTo);

  if (beamReq.error) {
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading the entry')}
        details={t('We cannot show this entry right now')}
        devDetails={beamReq.error.message}
      />
    );
  }

  return (
    <Card padding="p-0" margin="mb-4">
      <React.Suspense fallback={<EntrySectionLoading />}>
        <BeamSection
          beamId={beamId}
          entryData={entryData}
          isLoggedIn={!!profileDataReq?.akashaProfile?.id}
          onNavigate={onNavigate}
          showLoginModal={showLoginModal}
        />
      </React.Suspense>
      <PendingReflect beamId={beamId} authorId={profileDataReq?.akashaProfile?.did.id} />
      <Stack spacing="gap-y-2">
        <ReflectFeed
          queryKey={`reflect-feed-${beamId}`}
          filters={{ where: { reflection: { isNull: true } } }}
          estimatedHeight={120}
          renderItem={itemData => (
            <>
              <Divider />
              <ReflectionCard
                entryData={itemData.node}
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
              <ReflectionPreview
                reflectionId={itemData.node.id}
                onNavigate={(options: { id: string; reflect?: boolean }) => {
                  getRoutingPlugin().navigateTo({
                    appName: '@akashaorg/app-akasha-integration',
                    getNavigationUrl: navRoutes =>
                      `${navRoutes.Reflect}/${options.id}${
                        options.reflect ? navRoutes.Reflect : ''
                      }`,
                  });
                }}
              />
            </>
          )}
          reflectionsOf={{ entryId: beamId, itemType: EntityTypes.BEAM }}
          itemSpacing={0}
          newItemsPublishedLabel={t('New Reflects published recently')}
          trackEvent={analyticsActions.trackEvent}
          locale={getTranslationPlugin().i18n.language}
        />
      </Stack>
    </Card>
  );
};

export default BeamPage;
