import React, { useRef } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BeamSection from './beam-section';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import EditableReflection from '@akashaorg/ui-lib-feed/lib/components/editable-reflection';
import {
  createReactiveVar,
  hasOwn,
  mapBeamEntryData,
  mapReflectEntryData,
  useAnalytics,
  useGetLogin,
  useNsfwToggling,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { EntityTypes, type ReflectEntryData } from '@akashaorg/typings/lib/ui';
import { ReflectFeed, ReflectionPreview } from '@akashaorg/ui-lib-feed';
import { AkashaBeamStreamModerationStatus } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useNavigate } from '@tanstack/react-router';
import {
  GetBeamByIdQuery,
  GetBeamStreamQuery,
} from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { EditableReflectionResolver } from '@akashaorg/ui-lib-feed/lib/components/editable-reflection/editable-reflection-resolver';

type BeamPageProps = {
  beamId: string;
  beamStream: GetBeamStreamQuery;
  beam: GetBeamByIdQuery;
};

const BeamPage: React.FC<BeamPageProps> = props => {
  const { beamId, beamStream, beam } = props;
  const { t } = useTranslation('app-akasha-integration');
  const { navigateToModal, getTranslationPlugin } = useRootComponentProps();
  const { data, loading: authenticating } = useGetLogin();
  const { showNsfw } = useNsfwToggling();
  const [analyticsActions] = useAnalytics();
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const isLoggedIn = !!data?.id;

  /**
   * Check the current moderation status of the beam
   */
  const moderationData = React.useMemo(() => {
    if (
      beamStream &&
      hasOwn(beamStream, 'node') &&
      hasOwn(beamStream.node, 'akashaBeamStreamList') &&
      beamStream.node.akashaBeamStreamList.edges?.[0]?.node &&
      hasOwn(beamStream.node.akashaBeamStreamList.edges[0].node, 'status')
    ) {
      return beamStream.node.akashaBeamStreamList.edges[0].node.status;
    }
  }, [beamStream]);

  const pendingReflectionsVar = createReactiveVar<ReflectEntryData[]>([]);
  const entryData = React.useMemo(() => {
    if (beam && hasOwn(beam, 'node') && hasOwn(beam.node, 'id')) {
      return beam.node;
    }
  }, [beam]);

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
      moderationData === AkashaBeamStreamModerationStatus.Nsfw &&
      (!showNsfw || (!isLoggedIn && !authenticating))
    );
  }, [authenticating, isLoggedIn, moderationData, showNsfw]);

  return (
    <Card padding="p-0" margin="mb-4">
      <Stack ref={wrapperRef} spacing="gap-y-2">
        <ReflectFeed
          pendingReflectionsVar={pendingReflectionsVar}
          header={
            <>
              <BeamSection
                beamId={beamId}
                entryData={mapBeamEntryData(entryData)}
                isLoggedIn={isLoggedIn}
                showNSFWCard={showNsfwCard}
                pendingReflectionsVar={pendingReflectionsVar}
                parentWrapperRef={wrapperRef}
                showLoginModal={showLoginModal}
              />
            </>
          }
          queryKey={`reflect-feed-${beamId}`}
          filters={{ where: { beamID: { equalTo: beamId } } }}
          estimatedHeight={120}
          renderItem={itemData => {
            return (
              <>
                <Divider />
                <EditableReflectionResolver
                  reflectID={itemData.node.reflectionID}
                  beamID={beamId}
                />
                <ReflectionPreview
                  reflectionId={itemData.node.reflectionID}
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
              </>
            );
          }}
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
