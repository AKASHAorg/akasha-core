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
  filterNsfwBeams?: (beamID: string) => void;
};

const BeamContentResolver: React.FC<BeamContentResolverProps> = ({ beamId, filterNsfwBeams }) => {
  const { beam, isLoading } = useIndividualBeam({ beamId });
  const { getRoutingPlugin } = useRootComponentProps();
  const { data: loginData, loading: authenticating } = useGetLogin();
  const isLoggedIn = !!loginData?.id;
  const { showNsfw } = useNsfwToggling();

  if (isLoading) return <EntryLoadingPlaceholder />;

  if (beam && hasOwn(beam, 'id')) {
    if ((beam.nsfw && !isLoggedIn && !authenticating) || (beam.nsfw && !showNsfw)) {
      filterNsfwBeams(beamId);
      return null;
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
