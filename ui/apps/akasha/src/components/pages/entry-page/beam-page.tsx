import React from 'react';
import getSDK from '@akashaorg/awf-sdk';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EntrySectionLoading from './entry-section-loading';
import BeamSection from './beam-section';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import EditableReflection from '@akashaorg/ui-lib-feed/lib/components/editable-reflection';
import { useParams } from 'react-router-dom';
import {
  hasOwn,
  mapBeamEntryData,
  mapReflectEntryData,
  useAnalytics,
  useGetLogin,
  useNsfwToggling,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import { ReflectFeed, ReflectionPreview } from '@akashaorg/ui-lib-feed';
import {
  useGetBeamByIdSuspenseQuery,
  useGetBeamStreamQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { AkashaBeamStreamModerationStatus } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';

const BeamPage: React.FC<unknown> = () => {
  const { beamId } = useParams<{
    beamId: string;
  }>();
  const sdk = getSDK();
  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin, navigateToModal, getTranslationPlugin } = useRootComponentProps();
  const { data, loading: authenticating } = useGetLogin();
  const { showNsfw } = useNsfwToggling();
  const [analyticsActions] = useAnalytics();
  const isLoggedIn = !!data?.id;
  const navigateTo = getRoutingPlugin().navigateTo;

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
  const entryData = React.useMemo(() => {
    if (beamReq.data && hasOwn(beamReq.data, 'node') && hasOwn(beamReq.data.node, 'id')) {
      return beamReq.data.node;
    }
  }, [beamReq]);

  const showLoginModal = () => {
    navigateToModal({
      name: 'login',
      message: 'To view explicit or sensitive content, please connect to confirm your consent.',
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
      <React.Suspense fallback={<EntrySectionLoading />}>
        <BeamSection
          beamId={beamId}
          entryData={mapBeamEntryData(entryData)}
          isLoggedIn={isLoggedIn}
          showLoginModal={showLoginModal}
          showNSFWCard={showNsfwCard}
        />
      </React.Suspense>
      <Stack spacing="gap-y-2">
        <ReflectFeed
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
                  navigateTo({
                    appName: '@akashaorg/app-akasha-integration',
                    getNavigationUrl: navRoutes => `${navRoutes.Reflect}/${itemData.node.id}`,
                  })
                }
                onReflect={() =>
                  navigateTo({
                    appName: '@akashaorg/app-akasha-integration',
                    getNavigationUrl: navRoutes =>
                      `${navRoutes.Reflect}/${itemData.node.id}${navRoutes.Reflect}`,
                  })
                }
              />
              <ReflectionPreview
                reflectionId={itemData.node.id}
                onNavigate={(options: { id: string; reflect?: boolean }) => {
                  navigateTo({
                    appName: '@akashaorg/app-akasha-integration',
                    getNavigationUrl: navRoutes =>
                      `${navRoutes.Reflect}/${options.id}${
                        options.reflect ? navRoutes.Reflect : ''
                      }`,
                  });
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
