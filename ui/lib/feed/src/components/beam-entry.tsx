import React from 'react';
import {
  hasOwn,
  mapBeamEntryData,
  useIndividualBeam,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import BeamCard from './cards/beam-card';
export type BeamEntryProps = {
  beamId: string;
};

const BeamEntry: React.FC<React.PropsWithChildren<BeamEntryProps>> = ({ beamId }) => {
  const { beam } = useIndividualBeam({ beamId });
  const { getRoutingPlugin } = useRootComponentProps();

  if (beam && hasOwn(beam, 'id')) {
    return (
      <BeamCard
        showHiddenContent={true}
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

export default BeamEntry;
