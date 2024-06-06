import React, { useLayoutEffect, useMemo, useRef } from 'react';
import getSDK from '@akashaorg/awf-sdk';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import { useGetReflectionStreamQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import BeamSection from './beam-section';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import {
  hasOwn,
  useAkashaStore,
  useAnalytics,
  useNsfwToggling,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { ReflectionPreview } from '@akashaorg/ui-lib-feed';
import { AkashaBeamStreamModerationStatus } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useNavigate } from '@tanstack/react-router';
import { EditableReflectionResolver, ReflectFeed } from '@akashaorg/ui-lib-feed';
import { BeamEntryData } from '@akashaorg/typings/lib/ui';

type BeamPageProps = {
  beamId: string;
  beamStatus: AkashaBeamStreamModerationStatus;
  entryData: BeamEntryData;
};

const BeamPage: React.FC<BeamPageProps> = props => {
  const { beamId, beamStatus, entryData } = props;
  const { t } = useTranslation('app-antenna');
  const { navigateToModal, logger } = useRootComponentProps();
  const {
    data: { authenticatedDID, isAuthenticating: authenticating },
  } = useAkashaStore();
  const { showNsfw } = useNsfwToggling();
  const [analyticsActions] = useAnalytics();
  const navigate = useNavigate();
  const isLoggedIn = !!authenticatedDID;

  const indexingDID = useRef(getSDK().services.gql.indexingDID);
  const filters = useMemo(() => {
    return { where: { beamID: { equalTo: beamId } } };
  }, [beamId]);

  // TODO: after usePendingReflections refactor, the pending reflect component can be moved inside the reflect feed component, thereby making these blocks and associated logic redundant and safe to be cleaned up
  const reflectionStreamQuery = useGetReflectionStreamQuery({
    variables: {
      first: 1,
      indexer: indexingDID.current,
      filters: filters,
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

  /**
   * showNsfwCard is used to determine whether to show the overlay for nsfw
   * content on individual beam pages. It is true if the beam in question is marked as nsfw and the
   * following conditions are met:
   * 1. The user toggled off NSFW content in their settings, or
   * 2. The user is not logged in.
   */
  const showNsfwCard = React.useMemo(() => {
    return (
      beamStatus === AkashaBeamStreamModerationStatus.Nsfw &&
      (!showNsfw || (!isLoggedIn && !authenticating))
    );
  }, [authenticating, beamStatus, isLoggedIn, showNsfw]);

  useLayoutEffect(() => {
    //resets initial scroll to top when page mounts
    scrollTo(0, 0);
  }, []);

  return (
    <Card padding="p-0" margin="mb-4">
      <ReflectFeed
        header={
          <BeamSection
            beamId={beamId}
            entryData={entryData}
            isLoggedIn={isLoggedIn}
            showNSFWCard={showNsfwCard}
            hasReflections={hasReflections}
            showLoginModal={showLoginModal}
            customStyle="mb-2"
          />
        }
        scrollRestorationStorageKey="beam-reflect-feed"
        lastScrollRestorationKey={beamId}
        itemType={EntityTypes.BEAM}
        filters={filters}
        estimatedHeight={150}
        scrollOptions={{ overScan: 5 }}
        renderItem={itemData => {
          return (
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
                    return;
                  }}
                />
              </div>
            </ErrorBoundary>
          );
        }}
        itemSpacing={0}
        trackEvent={analyticsActions.trackEvent}
      />
    </Card>
  );
};

export default BeamPage;
