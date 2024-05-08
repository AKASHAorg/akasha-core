import React from 'react';
import BeamCard from './cards/beam-card';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import { hasOwn, mapBeamEntryData, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetBeamByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';

export type BeamContentResolverProps = {
  beamId: string;
  showNSFWCard?: boolean;
};

const BeamContentResolver: React.FC<BeamContentResolverProps> = ({ beamId, showNSFWCard }) => {
  const { getRoutingPlugin, navigateToModal } = useRootComponentProps();
  const _navigateToModal = React.useRef(navigateToModal);

  const showLoginModal = React.useCallback(
    (redirectTo?: { modal: ModalNavigationOptions }, message?: string) => {
      _navigateToModal.current?.({
        name: 'login',
        redirectTo,
        message,
      });
    },
    [],
  );
  const beamReq = useGetBeamByIdQuery({
    variables: {
      id: beamId,
    },
    fetchPolicy: 'cache-first',
    skip: !beamId,
  });

  if (beamReq.loading) return <EntryCardLoading />;

  const entryData =
    beamReq.data?.node && hasOwn(beamReq.data.node, 'id') ? beamReq.data.node : null;

  return (
    entryData && (
      <BeamCard
        entryData={mapBeamEntryData(entryData)}
        contentClickable={true}
        /* Display the overlay according to the passed prop showNSFWCard
         * or the nsfw property of the beam object just fetched through the
         * useIndividualBeam hook (see BeamFeed).
         * */
        showNSFWCard={showNSFWCard ?? entryData.nsfw}
        showLoginModal={showLoginModal}
        onContentClick={() =>
          getRoutingPlugin().navigateTo({
            appName: '@akashaorg/app-antenna',
            getNavigationUrl: navRoutes => `${navRoutes.Beam}/${entryData.id}`,
          })
        }
        onReflect={() =>
          getRoutingPlugin().navigateTo({
            appName: '@akashaorg/app-antenna',
            getNavigationUrl: navRoutes => `${navRoutes.Beam}/${entryData.id}${navRoutes.Reflect}`,
          })
        }
      />
    )
  );
};

export default BeamContentResolver;
