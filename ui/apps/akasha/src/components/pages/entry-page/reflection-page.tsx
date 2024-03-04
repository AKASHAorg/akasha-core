import React from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BackToOriginalBeam from '@akashaorg/ui-lib-feed/lib/components/back-to-original-beam';
import EntrySectionLoading from './entry-section-loading';
import ReflectionSection from './reflection-section';
import ReflectFeed from '@akashaorg/ui-lib-feed/lib/components/reflect-feed';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import EditableReflection from '@akashaorg/ui-lib-feed/lib/components/editable-reflection';
import {
  createReactiveVar,
  hasOwn,
  mapReflectEntryData,
  useAnalytics,
  useGetLogin,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { EntityTypes, type ReflectEntryData } from '@akashaorg/typings/lib/ui';
import { useGetReflectionByIdSuspenseQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { ReflectionPreview } from '@akashaorg/ui-lib-feed';
import { usePendingReflections } from '@akashaorg/ui-awf-hooks/lib/use-pending-reflections';
import { PendingReflect } from '../../reflect-editor/pending-reflect';
import { useNavigate } from '@tanstack/react-router';

type ReflectionPageProps = {
  reflectionId: string;
};

const ReflectionPage: React.FC<ReflectionPageProps> = props => {
  const { reflectionId } = props;
  const { t } = useTranslation('app-akasha-integration');
  const { navigateToModal, getTranslationPlugin } = useRootComponentProps();
  const { data } = useGetLogin();
  const [analyticsActions] = useAnalytics();
  const navigate = useNavigate();
  const isLoggedIn = !!data?.id;
  const reflectionReq = useGetReflectionByIdSuspenseQuery({ variables: { id: reflectionId } });
  const pendingReflectionsVar = createReactiveVar<ReflectEntryData[]>([]);
  const { pendingReflections } = usePendingReflections(pendingReflectionsVar);
  const entryData = React.useMemo(() => {
    if (
      reflectionReq.data &&
      hasOwn(reflectionReq.data, 'node') &&
      hasOwn(reflectionReq.data.node, 'id')
    ) {
      return reflectionReq.data.node;
    }
  }, [reflectionReq]);

  const showLoginModal = (title?: string, message?: string) => {
    navigateToModal({
      name: 'login',
      title,
      message,
    });
  };

  const onNavigateToOriginalBeam = (beamId: string, reflect?: boolean) => {
    navigate({
      to: reflect ? '/beam/$beamId/reflect' : '/beam/$beamId',
      params: {
        beamId,
      },
      replace: true,
    });
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
      <Stack spacing="gap-y-2">
        <ReflectFeed
          pendingReflectionsVar={pendingReflectionsVar}
          header={
            <>
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
                  pendingReflectionsVar={pendingReflectionsVar}
                />
              </React.Suspense>
              {pendingReflections
                .filter(
                  content => hasOwn(content, 'reflection') && content.reflection === reflectionId,
                )
                .map((content, index) => (
                  <PendingReflect key={`pending-${index}-${reflectionId}`} entryData={content} />
                ))}
            </>
          }
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
                  navigate({
                    to: '/reflection/$reflectionId',
                    params: {
                      reflectionId: itemData.node.id,
                    },
                  })
                }
                onReflect={() =>
                  navigate({
                    to: '/reflection/$reflectionId/reflect',
                    params: {
                      reflectionId: itemData.node.id,
                    },
                  })
                }
              />
              <ReflectionPreview
                reflectionId={itemData.node.id}
                onNavigate={(options: { id: string; reflect?: boolean }) => {
                  navigate({
                    to: options.reflect
                      ? '/reflection/$reflectionId/reflect'
                      : '/reflection/$reflectionId',
                    params: {
                      reflectionId: options.id,
                    },
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
