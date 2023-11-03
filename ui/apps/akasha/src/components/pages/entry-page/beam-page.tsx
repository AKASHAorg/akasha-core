import React from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';
import EntrySectionLoading from './entry-section-loading';
import BeamSection from './beam-section';
import { useParams } from 'react-router-dom';
import {
  useGetBeamByIdQuery,
  useGetMyProfileQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import {
  hasOwn,
  useAnalytics,
  useEntryNavigation,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import { PendingReflect } from './pending-reflect';

const BeamPage: React.FC<unknown> = () => {
  const { beamId } = useParams<{
    beamId: string;
  }>();
  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin, navigateToModal } = useRootComponentProps();
  const beamReq = useGetBeamByIdQuery({ id: beamId }, { select: response => response.node });
  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });

  const [analyticsActions] = useAnalytics();

  const loggedProfileData = profileDataReq.data;
  const entryData = beamReq.data && hasOwn(beamReq.data, 'id') ? beamReq.data : null;

  const showLoginModal = () => {
    navigateToModal({ name: 'login' });
  };

  const onNavigate = useEntryNavigation(getRoutingPlugin().navigateTo);

  if (beamReq.status === 'error')
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading the entry')}
        details={t('We cannot show this entry right now')}
        devDetails={beamReq.error as string}
      />
    );

  if (beamReq.status === 'loading') return <EntrySectionLoading />;

  return (
    <Card padding="p-0">
      <BeamSection
        beamId={beamId}
        entryData={entryData}
        isLoggedIn={!!loggedProfileData?.id}
        onNavigate={onNavigate}
        showLoginModal={showLoginModal}
      />
      <PendingReflect beamId={beamId} loggedProfileData={loggedProfileData} />
      <Stack spacing="gap-y-2">
        <FeedWidget
          queryKey="akasha-beam-page-query"
          itemType={EntityTypes.REFLECT}
          reflectionsOf={{ beamId, itemType: EntityTypes.BEAM }}
          loggedProfileData={loggedProfileData}
          onEntryFlag={() => {
            return () => {
              //@TODO
            };
          }}
          onEntryRemove={() => {
            //@TODO
          }}
          itemSpacing={8}
          newItemsPublishedLabel={t('New Reflects published recently')}
          onLoginModalOpen={showLoginModal}
          trackEvent={analyticsActions.trackEvent}
          onNavigate={onNavigate}
        />
      </Stack>
    </Card>
  );
};

export default BeamPage;
