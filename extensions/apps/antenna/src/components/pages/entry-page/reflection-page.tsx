import React, { useLayoutEffect, useMemo, useRef } from 'react';
import getSDK from '@akashaorg/core-sdk';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BackToOriginalBeam from '@akashaorg/ui-lib-feed/lib/components/back-to-original-beam';
import ReflectionSection from './reflection-section';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import { EntityTypes, ReflectionData } from '@akashaorg/typings/lib/ui';
import {
  hasOwn,
  useAkashaStore,
  useAnalytics,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { ReflectionPreview } from '@akashaorg/ui-lib-feed';
import { useNavigate } from '@tanstack/react-router';
import { EditableReflectionResolver, ReflectFeed } from '@akashaorg/ui-lib-feed';
import {
  useGetBeamByIdQuery,
  useGetBeamStreamQuery,
  useGetReflectionStreamQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

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

  const indexingDID = useRef(getSDK().services.gql.indexingDID);

  const { data: beamByIdData } = useGetBeamByIdQuery({
    variables: { id: reflectionData.beamID },
    skip: !reflectionData.beamID,
  });

  const { data: beamStreamData } = useGetBeamStreamQuery({
    variables: {
      indexer: indexingDID.current,
      filters: { where: { beamID: { equalTo: reflectionData.beamID } } },
      last: 1,
    },
    skip: !reflectionData.beamID,
  });

  const { data: reflectionStreamData } = useGetReflectionStreamQuery({
    variables: {
      indexer: indexingDID.current,
      filters: { where: { reflectionID: { equalTo: reflectionData.id } } },
      last: 1,
    },
    skip: !reflectionData.id,
  });
  /**
   * a beam is considered active if:
   * 1. data from getBeamById query has active as true and
   * 2. data from getBeamStream query has active as true
   */
  const isBeamActive = React.useMemo(() => {
    let beamByIdActive: boolean;
    let beamStreamActive: boolean;

    if (beamByIdData && hasOwn(beamByIdData.node, 'active')) {
      beamByIdActive = beamByIdData.node.active;
    }

    if (beamStreamData && hasOwn(beamStreamData.node, 'akashaBeamStreamList')) {
      beamStreamActive = beamStreamData.node.akashaBeamStreamList.edges[0]?.node?.active ?? false;
    }

    return beamByIdActive && beamStreamActive;
  }, [beamByIdData, beamStreamData]);

  /**
   * a reflection is considered active if:
   * 1. reflectionData passed as prop has active as true and
   * 2. data from getReflectionStream query has active as true
   */
  const isReflectionActive = React.useMemo(() => {
    let reflectionStreamActive: boolean;
    if (reflectionStreamData && hasOwn(reflectionStreamData.node, 'akashaReflectStreamList')) {
      reflectionStreamActive =
        reflectionStreamData.node.akashaReflectStreamList.edges[0]?.node?.active ?? false;
    }
    return reflectionData.active && reflectionStreamActive;
  }, [reflectionStreamData, reflectionData.active]);

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
              isBeamActive={isBeamActive}
              isReflectionActive={isReflectionActive}
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
