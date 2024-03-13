import React from 'react';
import getSDK from '@akashaorg/awf-sdk';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EntrySectionLoading from './entry-section-loading';
import BeamSection from './beam-section';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import EditableReflection from '@akashaorg/ui-lib-feed/lib/components/editable-reflection';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
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
import {
  useGetBeamByIdSuspenseQuery,
  useGetBeamStreamQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useNavigate } from '@tanstack/react-router';

type BeamPageProps = {
  beamId: string;
};

const BeamPage: React.FC<BeamPageProps> = props => {
  const { beamId } = props;
  const { t } = useTranslation('app-akasha-integration');
  const { navigateToModal, getTranslationPlugin } = useRootComponentProps();
  const { data, loading: authenticating } = useGetLogin();
  const { showNsfw } = useNsfwToggling();
  const [analyticsActions] = useAnalytics();
  const navigate = useNavigate();
  const isLoggedIn = !!data?.id;
  const sdk = getSDK();

  /**
   * Fetch beam data from the Indexed Stream
   */
  const beamStreamCheckQuery = useGetBeamStreamQuery({
    variables: {
      first: 1,
      indexer: sdk.services.gql.indexingDID,
      filters: { where: { beamID: { equalTo: beamId } } },
    },
  });

  /**
   * Check the current moderation status of the beam
   */
  const moderationData = React.useMemo(() => {
    if (
      beamStreamCheckQuery.data &&
      hasOwn(beamStreamCheckQuery.data, 'node') &&
      hasOwn(beamStreamCheckQuery.data.node, 'akashaBeamStreamList') &&
      hasOwn(beamStreamCheckQuery.data.node.akashaBeamStreamList.edges[0].node, 'status')
    ) {
      return beamStreamCheckQuery.data.node.akashaBeamStreamList.edges[0].node.status;
    }
  }, [beamStreamCheckQuery]);

  const beamReq = useGetBeamByIdSuspenseQuery({
    variables: { id: beamId },
  });
  const pendingReflectionsVar = createReactiveVar<ReflectEntryData[]>([]);
  const entryData = React.useMemo(() => {
    if (beamReq.data && hasOwn(beamReq.data, 'node') && hasOwn(beamReq.data.node, 'id')) {
      return beamReq.data.node;
    }
  }, [beamReq]);

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

  if (beamStreamCheckQuery.loading) {
    return <Spinner />;
  }

  if (beamReq.error) {
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading the entry')}
        details={t('We cannot show this entry right now')}
        devDetails={beamReq.error.message}
      />
    );
  }

  return (
    <Card padding="p-0" margin="mb-4">
      <Stack spacing="gap-y-2">
        <ReflectFeed
          pendingReflectionsVar={pendingReflectionsVar}
          header={
            <React.Suspense fallback={<EntrySectionLoading />}>
              <BeamSection
                beamId={beamId}
                entryData={mapBeamEntryData(entryData)}
                isLoggedIn={isLoggedIn}
                showLoginModal={showLoginModal}
                showNSFWCard={showNsfwCard}
                pendingReflectionsVar={pendingReflectionsVar}
              />
            </React.Suspense>
          }
          queryKey={`reflect-feed-${beamId}`}
          filters={{ where: { reflection: { isNull: true } } }}
          estimatedHeight={120}
          renderItem={itemData => (
            <>
              <Divider />
              <EditableReflection
                entryData={mapReflectEntryData(itemData.node)}
                reflectToId={beamId}
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
                  return;
                }}
              />
            </>
          )}
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
