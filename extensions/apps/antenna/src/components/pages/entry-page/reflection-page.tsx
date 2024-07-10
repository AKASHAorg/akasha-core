import React, { useLayoutEffect, useMemo } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BackToOriginalBeam from '@akashaorg/ui-lib-feed/lib/components/back-to-original-beam';
import ReflectionSection from './reflection-section';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import { EntityTypes, ReflectionData } from '@akashaorg/typings/lib/ui';
import { useAkashaStore, useAnalytics, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { ReflectionPreview } from '@akashaorg/ui-lib-feed';
import { useNavigate } from '@tanstack/react-router';
import { EditableReflectionResolver, ReflectFeed } from '@akashaorg/ui-lib-feed';

type ReflectionPageProps = {
  reflectionData: ReflectionData;
};

const ReflectionPage: React.FC<ReflectionPageProps> = props => {
  const { reflectionData } = props;
  const { t } = useTranslation('app-antenna');
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const { navigateToModal, logger } = useRootComponentProps();
  const [analyticsActions] = useAnalytics();
  const navigate = useNavigate();
  const isLoggedIn = !!authenticatedDID;

  const filters = useMemo(() => {
    return {
      and: [
        { where: { isReply: { equalTo: true } } },
        {
          where: {
            replyTo: {
              equalTo: reflectionData.id,
            },
          },
        },
      ],
    };
  }, [reflectionData.id]);

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

  useLayoutEffect(() => {
    //resets initial scroll to top when page mounts
    scrollTo(0, 0);
  }, []);

  return (
    <Card padding="p-0" margin="mb-4">
      <ReflectFeed
        reflectToId={reflectionData.id}
        header={
          <Stack spacing="gap-y-2">
            <BackToOriginalBeam
              label={t('Back to original beam')}
              onClick={() => onNavigateToOriginalBeam(reflectionData.beamID)}
            />
            <ReflectionSection
              beamId={reflectionData.beamID}
              reflectionId={reflectionData.id}
              reflectionData={reflectionData}
              isLoggedIn={isLoggedIn}
              showLoginModal={showLoginModal}
            />
          </Stack>
        }
        scrollRestorationStorageKey="reflection-reflect-feed"
        lastScrollRestorationKey={reflectionData.id}
        itemType={EntityTypes.REFLECT}
        itemSpacing={0}
        trackEvent={analyticsActions.trackEvent}
        estimatedHeight={120}
        filters={filters}
        dataTestId="reflect-feed"
        renderItem={itemData => (
          <ErrorBoundary
            errorObj={{
              type: 'script-error',
              title: t('Error in loading reflection.'),
            }}
            logger={logger}
          >
            <div>
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
                reflectionId={itemData.reflectionID}
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
            </div>
          </ErrorBoundary>
        )}
      />
    </Card>
  );
};

export default ReflectionPage;
