import React from 'react';
import {
  hasOwn,
  mapBeamEntryData,
  useGetLogin,
  useIndividualBeam,
  useRootComponentProps,
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

  if (isLoading) return <EntryLoadingPlaceholder />;

  if (beam && hasOwn(beam, 'id')) {
    return (
      <BeamCard
        entryData={mapBeamEntryData(beam)}
        contentClickable={true}
        showNSFWCard={false}
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
        isLoggedIn={isLoggedIn}
      />
    );
  }
};

export default BeamContentResolver;
