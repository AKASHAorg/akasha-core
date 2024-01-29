import React from 'react';
import {
  hasOwn,
  mapBeamEntryData,
  useGetLogin,
  useIndividualBeam,
  useRootComponentProps,
  useNsfwToggling,
} from '@akashaorg/ui-awf-hooks';
import BeamCard from './cards/beam-card';
import EntryLoadingPlaceholder from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';

export type BeamContentResolverProps = {
  beamId: string;
  cursor?: string;
};

const BeamContentResolver: React.FC<BeamContentResolverProps> = ({ beamId, cursor }) => {
  const { beam, isLoading } = useIndividualBeam({ beamId });
  const { getRoutingPlugin } = useRootComponentProps();
  const { data: loginData, loading: authenticating } = useGetLogin();
  const isLoggedIn = !!loginData?.id;
  const { showNsfw } = useNsfwToggling();

  if (isLoading) return <EntryLoadingPlaceholder />;

  if (beam && hasOwn(beam, 'id')) {
    // if (beam.id === 'kjzl6kcym7w8y9x3qvi8q4ry7xytr14ijnc7as4j0oyfwkplvgjkgvk0zzhs08g') {
    //   console.log('error', beam);
    // }
    if ((beam.nsfw && !isLoggedIn && !authenticating) || (beam.nsfw && !showNsfw)) {
      console.log('beamid', beamId);
      //  return null;
    }

    return (
      <BeamCard
        entryData={mapBeamEntryData(beam)}
        contentClickable={true}
        onContentClick={() =>
          getRoutingPlugin().navigateTo({
            appName: '@akashaorg/app-akasha-integration',
            getNavigationUrl: navRoutes => `${navRoutes.Beam}/${beam.id}`,
          })
        }
        onReflect={() =>
          getRoutingPlugin().navigateTo({
            appName: '@akashaorg/app-akasha-integration',
            getNavigationUrl: navRoutes => `${navRoutes.Beam}/${beam.id}${navRoutes.Reflect}`,
          })
        }
      />
    );
  }
};

export default BeamContentResolver;
