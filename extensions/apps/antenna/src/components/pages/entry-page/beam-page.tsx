import React, { useLayoutEffect, useMemo } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import BeamSection from './beam-section';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import {
  useAkashaStore,
  useAnalytics,
  useNsfwToggling,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import { ReflectionPreview } from '@akashaorg/ui-lib-feed';
import { AkashaBeamStreamModerationStatus } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useNavigate } from '@tanstack/react-router';
import { EditableReflectionResolver, ReflectFeed } from '@akashaorg/ui-lib-feed';
import { BeamData } from '@akashaorg/typings/lib/ui';

type BeamPageProps = {
  beamId: string;
  isActive: boolean;
  beamStatus: AkashaBeamStreamModerationStatus;
  beamData: BeamData;
};

const BeamPage: React.FC<BeamPageProps> = props => {
  const { beamId, isActive, beamStatus, beamData } = props;
  const { t } = useTranslation('app-antenna');
  const { navigateToModal, logger } = useRootComponentProps();
  const {
    data: { authenticatedDID, isAuthenticating: authenticating },
  } = useAkashaStore();
  const { showNsfw } = useNsfwToggling();
  const [analyticsActions] = useAnalytics();
  const navigate = useNavigate();
  const isLoggedIn = !!authenticatedDID;

  const filters = useMemo(() => {
    return { where: { beamID: { equalTo: beamId } } };
  }, [beamId]);

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
        reflectToId={beamId}
        header={
          <BeamSection
            isActive={isActive && beamData.active}
            beamData={beamData}
            isLoggedIn={isLoggedIn}
            showNSFWCard={showNsfwCard}
            showLoginModal={showLoginModal}
          />
        }
        scrollRestorationStorageKey="beam-reflect-feed"
        lastScrollRestorationKey={beamId}
        itemType={EntityTypes.BEAM}
        filters={filters}
        estimatedHeight={150}
        scrollOptions={{ overScan: 5 }}
        dataTestId="reflect-feed"
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
