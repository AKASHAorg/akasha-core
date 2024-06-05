import React, { useLayoutEffect, useMemo, useRef } from 'react';
import getSDK from '@akashaorg/awf-sdk';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import { useGetReflectionStreamQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BackToOriginalBeam from '@akashaorg/ui-lib-feed/lib/components/back-to-original-beam';
import ReflectionSection from './reflection-section';
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
import { EditableReflectionResolver, ReflectFeed } from '@akashaorg/ui-lib-feed';

type ReflectionPageProps = {
  reflection: GetReflectionByIdQuery;
};

const ReflectionPage: React.FC<ReflectionPageProps> = props => {
  const { reflection } = props;
  const { t } = useTranslation('app-antenna');
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const { navigateToModal, logger } = useRootComponentProps();
  const [analyticsActions] = useAnalytics();
  const navigate = useNavigate();
  const isLoggedIn = !!authenticatedDID;

  const entryData = React.useMemo(() => {
    if (reflection && hasOwn(reflection, 'node') && hasOwn(reflection.node, 'id')) {
      return reflection.node;
    }
  }, [reflection]);

  const indexingDID = useRef(getSDK().services.gql.indexingDID);
  const filters = useRef({
    and: [
      { where: { isReply: { equalTo: true } } },
      { where: { active: { equalTo: true } } },
      {
        where: {
          replyTo: {
            equalTo: entryData.id,
          },
        },
      },
    ],
  });
  // TODO: after usePendingReflections refactor, the pending reflect component
  //  can be moved inside the reflect feed component, thereby making these blocks
  //  and associated logic redundant and safe to be cleaned up
  const reflectionStreamQuery = useGetReflectionStreamQuery({
    variables: {
      first: 1,
      indexer: indexingDID.current,
      filters: filters.current,
    },
    fetchPolicy: 'no-cache',
  });
  const hasReflections = useMemo(() => {
    if (
      reflectionStreamQuery.data?.node &&
      hasOwn(reflectionStreamQuery.data.node, 'akashaReflectStreamList')
    ) {
      return !!reflectionStreamQuery.data.node?.akashaReflectStreamList?.edges?.length;
    }
  }, [reflectionStreamQuery.data]);

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
        header={
          <Stack spacing="gap-y-2">
            <BackToOriginalBeam
              label={t('Back to original beam')}
              onClick={() => onNavigateToOriginalBeam(entryData.beam?.id)}
            />
            <ReflectionSection
              beamId={entryData.beam?.id}
              reflectionId={entryData.id}
              entryData={mapReflectEntryData(entryData)}
              isLoggedIn={isLoggedIn}
              hasReflections={hasReflections}
              showLoginModal={showLoginModal}
              customStyle="mb-2"
            />
          </Stack>
        }
        scrollRestorationStorageKey="reflection-reflect-feed"
        lastScrollRestorationKey={entryData.id}
        itemType={EntityTypes.REFLECT}
        itemSpacing={0}
        trackEvent={analyticsActions.trackEvent}
        estimatedHeight={120}
        filters={filters.current}
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
            </>
          </ErrorBoundary>
        )}
      />
    </Card>
  );
};

export default ReflectionPage;
