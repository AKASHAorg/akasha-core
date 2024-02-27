import React from 'react';
import {
  hasOwn,
  mapBeamEntryData,
  useIndividualBeam,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import BeamCard from './cards/beam-card';
import EntryLoadingPlaceholder from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';

export type BeamContentResolverProps = {
  beamId: string;
  showNSFWCard?: boolean;
  showLoginModal?: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const BeamContentResolver: React.FC<BeamContentResolverProps> = ({
  beamId,
  showNSFWCard,
  showLoginModal,
}) => {
  const { beam, isLoading } = useIndividualBeam({ beamId });
  const { getRoutingPlugin } = useRootComponentProps();

  if (isLoading) return <EntryLoadingPlaceholder />;

  if (beam && hasOwn(beam, 'id')) {
    return (
      <BeamCard
        entryData={mapBeamEntryData(beam)}
        contentClickable={true}
        /* Display the overlay according to the passed prop showNSFWCard
         * or the nsfw property of the beam object just fetched through the
         * useIndividualBeam hook (see BeamFeed).
         * */
        showNSFWCard={showNSFWCard ?? beam.nsfw}
        showLoginModal={showLoginModal}
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
