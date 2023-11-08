import React from 'react';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import BeamCard from '@akashaorg/ui-lib-feed/lib/components/cards/beam-card';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';
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

const BeamPage: React.FC = () => {
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

  return (
    <>
      {beamReq.status === 'loading' && <EntryCardLoading /> /*@TODO create full beam page loader */}
      {beamReq.status === 'error' && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the entry')}
          details={t('We cannot show this entry right now')}
          devDetails={beamReq.error as string}
        />
      )}
      {beamReq.status === 'success' && (
        <Card padding="p-0">
          <Stack spacing="gap-y-2">
            <BeamCard entryData={entryData} noWrapperCard={true} contentClickable={false} />
            <Divider />
            <Stack padding="px-2">
              {!loggedProfileData?.did?.id && (
                <EditorPlaceholder
                  onClick={showLoginModal}
                  profileId={null}
                  buttonLabel={t('Reflect')}
                  placeholderLabel={t('Share your thoughts')}
                />
              )}
              {loggedProfileData?.did?.id && entryData?.active && (
                /*@TODO fix inline editor */
                <Extension
                  name={`inline-editor_reflect_${entryData?.id}`}
                  extensionData={{
                    itemId: beamId,
                    itemType: EntityTypes.REFLECT,
                    action: 'reflect',
                  }}
                />
              )}
            </Stack>
            {/*<FeedWidget*/}
            {/*  queryKey="akasha-beam-page-query"*/}
            {/*  itemType={EntityTypes.REFLECT}*/}
            {/*  beamId={beamId}*/}
            {/*  loggedProfileData={loggedProfileData}*/}
            {/*  onLoginModalOpen={showLoginModal}*/}
            {/*  onEntryFlag={() => {*/}
            {/*    return () => {*/}
            {/*      //@TODO*/}
            {/*    };*/}
            {/*  }}*/}
            {/*  onEntryRemove={() => {*/}
            {/*    //@TODO*/}
            {/*  }}*/}
            {/*  itemSpacing={8}*/}
            {/*  trackEvent={analyticsActions.trackEvent}*/}
            {/*  onNavigate={onNavigate}*/}
            {/*  newItemsPublishedLabel={t('New Beams published recently')}*/}
            {/*/>*/}
          </Stack>
        </Card>
      )}
    </>
  );
};

export default BeamPage;
