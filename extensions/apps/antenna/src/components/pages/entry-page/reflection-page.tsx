import React, { useRef } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BackToOriginalBeam from '@akashaorg/ui-lib-feed/lib/components/back-to-original-beam';
import ReflectionSection from './reflection-section';
import ReflectFeed from '@akashaorg/ui-lib-feed/lib/components/reflect-feed.new';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import {
  hasOwn,
  mapReflectEntryData,
  useAkashaStore,
  useAnalytics,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { ReflectionPreview } from '@akashaorg/ui-lib-feed';
import { useNavigate } from '@tanstack/react-router';
import { GetReflectionByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { EditableReflectionResolver } from '@akashaorg/ui-lib-feed/lib/components/editable-reflection/editable-reflection-resolver';
import { EntityTypes } from '@akashaorg/typings/lib/ui';

type ReflectionPageProps = {
  reflection: GetReflectionByIdQuery;
};

const ReflectionPage: React.FC<ReflectionPageProps> = props => {
  const { reflection } = props;
  const { t } = useTranslation('app-antenna');
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;
  const { navigateToModal, logger } = useRootComponentProps();
  const [analyticsActions] = useAnalytics();
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

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
              parentWrapperRef={wrapperRef}
              showLoginModal={showLoginModal}
            />
          </>
        </>
        <ReflectFeed
          itemType={EntityTypes.REFLECT}
          itemSpacing={0}
          trackEvent={analyticsActions.trackEvent}
          estimatedHeight={120}
          filters={{
            and: [
              { where: { isReply: { equalTo: true } } },
              {
                where: {
                  replyTo: {
                    equalTo: entryData.id,
                  },
                },
              },
            ],
          }}
          renderItem={itemData => (
            <ErrorBoundary
              errorObj={{
                type: 'script-error',
                title: t('Error in loading reflection.'),
              }}
              logger={logger}
            >
              <>
                <Divider />
                <EditableReflectionResolver
                  reflectID={itemData.reflectionID}
                  onContentClick={() => {
                    navigate({
                      to: '/reflection/$reflectionId',
                      params: {
                        reflectionId: itemData.reflectionID,
                      },
                    });
                  }}
                  onReflect={() => {
                    navigate({
                      to: '/reflection/$reflectionId/reflect',
                      params: {
                        reflectionId: itemData.reflectionID,
                      },
                    });
                  }}
                />
                <ReflectionPreview
                  reflectionId={itemData.id}
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
            </ErrorBoundary>
          )}
        />
      </Stack>
    </Card>
  );
};

export default ReflectionPage;
