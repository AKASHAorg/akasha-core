import React, { useRef } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BackToOriginalBeam from '@akashaorg/ui-lib-feed/lib/components/back-to-original-beam';
import ReflectionSection from './reflection-section';
import ReflectFeed from '@akashaorg/ui-lib-feed/lib/components/reflect-feed';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import EditableReflection from '@akashaorg/ui-lib-feed/lib/components/editable-reflection';
import {
  createReactiveVar,
  hasOwn,
  mapReflectEntryData,
  useAnalytics,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { EntityTypes, type ReflectEntryData } from '@akashaorg/typings/lib/ui';
import { ReflectionPreview } from '@akashaorg/ui-lib-feed';
import { useNavigate } from '@tanstack/react-router';
import { GetReflectionByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

type ReflectionPageProps = {
  reflectionId: string;
  reflection: GetReflectionByIdQuery;
  isLoggedIn: boolean;
};

const ReflectionPage: React.FC<ReflectionPageProps> = props => {
  const { reflectionId, reflection, isLoggedIn } = props;
  const { t } = useTranslation('app-antenna');
  const { navigateToModal, getTranslationPlugin } = useRootComponentProps();
  const [analyticsActions] = useAnalytics();
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const pendingReflectionsVar = createReactiveVar<ReflectEntryData[]>([]);

  const entryData = React.useMemo(() => {
    if (reflection && hasOwn(reflection, 'node') && hasOwn(reflection.node, 'id')) {
      return reflection.node;
    }
  }, [reflection]);

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
              <>
                <ReflectionSection
                  beamId={entryData.beam?.id}
                  reflectionId={entryData.id}
                  entryData={mapReflectEntryData(entryData)}
                  isLoggedIn={isLoggedIn}
                  pendingReflectionsVar={pendingReflectionsVar}
                  parentWrapperRef={wrapperRef}
                  showLoginModal={showLoginModal}
                />
              </>
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
