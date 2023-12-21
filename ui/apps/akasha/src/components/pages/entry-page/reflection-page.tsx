import React from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BackToOriginalBeam from '@akashaorg/ui-lib-feed/lib/components/back-to-original-beam';
import EntrySectionLoading from './entry-section-loading';
import ReflectionSection from './reflection-section';
import ReflectFeed from '@akashaorg/ui-lib-feed/lib/components/reflect-feed';
import EditableReflection from '@akashaorg/ui-lib-feed/lib/components/editable-reflection';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { useParams } from 'react-router-dom';
import {
  hasOwn,
  mapReflectEntryData,
  useAnalytics,
  useLoggedIn,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import { useGetReflectionByIdSuspenseQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { ReflectionPreview } from '@akashaorg/ui-lib-feed';

const ReflectionPage: React.FC<unknown> = () => {
  const { reflectionId } = useParams<{
    reflectionId: string;
  }>();
  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin, navigateToModal, getTranslationPlugin } = useRootComponentProps();
  const { isLoggedIn } = useLoggedIn();
  const [analyticsActions] = useAnalytics();
  const navigateTo = getRoutingPlugin().navigateTo;
  const reflectionReq = useGetReflectionByIdSuspenseQuery({ variables: { id: reflectionId } });
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

  const onNavigateToOriginalBeam = (beamId: string, reflect?: boolean) => {
    navigateTo(
      {
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: navRoutes =>
          `${navRoutes.Beam}/${beamId}${reflect ? navRoutes.Reflect : ''}`,
      },
      true,
    );
  };

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
        onClick={() => onNavigateToOriginalBeam(entryData.beam?.id)}
      />
      <React.Suspense fallback={<EntrySectionLoading />}>
        <ReflectionSection
          beamId={entryData.beam?.id}
          reflectionId={entryData.id}
          entryData={mapReflectEntryData(entryData)}
          isLoggedIn={isLoggedIn}
          showLoginModal={showLoginModal}
        />
      </React.Suspense>
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
            <>
              <Divider />
              <EditableReflection
                entryData={mapReflectEntryData(itemData.node)}
                reflectToId={mapReflectEntryData(itemData.node).id}
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
        />
      </Stack>
    </Card>
  );
};

export default ReflectionPage;
