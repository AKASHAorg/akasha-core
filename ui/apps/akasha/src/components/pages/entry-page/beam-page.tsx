import React from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EntrySectionLoading from './entry-section-loading';
import BeamSection from './beam-section';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import EditableReflection from '@akashaorg/ui-lib-feed/lib/components/editable-reflection';
import { useParams } from 'react-router-dom';
import {
  createReactiveVar,
  hasOwn,
  mapBeamEntryData,
  mapReflectEntryData,
  useAnalytics,
  useGetLogin,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { EntityTypes, type ReflectEntryData } from '@akashaorg/typings/lib/ui';
import { ReflectFeed, ReflectionPreview } from '@akashaorg/ui-lib-feed';
import { useGetBeamByIdSuspenseQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { PendingReflect } from '../../reflect-editor/pending-reflect';
import { usePendingReflections } from '@akashaorg/ui-awf-hooks/lib/use-pending-reflections';

const BeamPage: React.FC<unknown> = () => {
  const { beamId } = useParams<{
    beamId: string;
  }>();
  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin, navigateToModal, getTranslationPlugin } = useRootComponentProps();
  const { data } = useGetLogin();
  const [analyticsActions] = useAnalytics();
  const isLoggedIn = !!data?.id;
  const navigateTo = getRoutingPlugin().navigateTo;
  const beamReq = useGetBeamByIdSuspenseQuery({
    variables: { id: beamId },
  });
  const pendingReflectionsVar = createReactiveVar<ReflectEntryData[]>([]);
  const { pendingReflections } = usePendingReflections(pendingReflectionsVar);
  const entryData = React.useMemo(() => {
    if (beamReq.data && hasOwn(beamReq.data, 'node') && hasOwn(beamReq.data.node, 'id')) {
      return beamReq.data.node;
    }
  }, [beamReq]);

  const showLoginModal = () => {
    navigateToModal({ name: 'login' });
  };

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
      <Stack spacing="gap-y-2">
        <ReflectFeed
          pendingReflectionsVar={pendingReflectionsVar}
          header={
            <React.Suspense fallback={<EntrySectionLoading />}>
              <BeamSection
                beamId={beamId}
                entryData={mapBeamEntryData(entryData)}
                isLoggedIn={isLoggedIn}
                showLoginModal={showLoginModal}
                pendingReflectionsVar={pendingReflectionsVar}
              />
              {pendingReflections
                .filter(content => !hasOwn(content, 'reflection') && content.beamID === beamId)
                .map((content, index) => (
                  <PendingReflect key={`pending-${index}-${beamId}`} entryData={content} />
                ))}
            </React.Suspense>
          }
          queryKey={`reflect-feed-${beamId}`}
          filters={{ where: { reflection: { isNull: true } } }}
          estimatedHeight={120}
          renderItem={itemData => (
            <>
              <Divider />
              <EditableReflection
                entryData={mapReflectEntryData(itemData.node)}
                reflectToId={beamId}
                contentClickable={true}
                onContentClick={() =>
                  navigateTo({
                    appName: '@akashaorg/app-akasha-integration',
                    getNavigationUrl: navRoutes => `${navRoutes.Reflect}/${itemData.node.id}`,
                  })
                }
                onReflect={() =>
                  navigateTo({
                    appName: '@akashaorg/app-akasha-integration',
                    getNavigationUrl: navRoutes =>
                      `${navRoutes.Reflect}/${itemData.node.id}${navRoutes.Reflect}`,
                  })
                }
              />
              <ReflectionPreview
                reflectionId={itemData.node.id}
                onNavigate={(options: { id: string; reflect?: boolean }) => {
                  navigateTo({
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
