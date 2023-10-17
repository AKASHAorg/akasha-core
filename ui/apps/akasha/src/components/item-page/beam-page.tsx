import React from 'react';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import BeamCard from '@akashaorg/ui-lib-feed/lib/components/cards/beam-card';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import EditorPlaceholderLoading from '@akashaorg/design-system-components/lib/components/EditorPlaceholder/EditorPlaceholderLoading';
import Extension from '@akashaorg/design-system-components/lib/components/Extension';
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
import { PendingReflect } from './pending-reflect';

const BeamPage: React.FC = () => {
  const { beamId } = useParams<{
    beamId: string;
  }>();
  const { t } = useTranslation('app-akasha-integration');
  const { uiEvents, getRoutingPlugin, navigateToModal } = useRootComponentProps();
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

  return (
    <Card padding="p-0">
      <Stack spacing="gap-y-2">
        {beamReq.status === 'loading' && (
          <>
            <EntryCardLoading noWrapperCard={true} />
            <Divider />
            <Stack padding="px-2">
              <EditorPlaceholderLoading />
            </Stack>
          </>
        )}
        {beamReq.status === 'success' && (
          <>
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
                <Extension
                  name={`inline-editor_reflect_${entryData?.id}`}
                  uiEvents={uiEvents}
                  data={{
                    itemId: beamId,
                    itemType: EntityTypes.REFLECT,
                    action: 'reflect',
                  }}
                />
              )}
            </Stack>
            <PendingReflect beamId={beamId} loggedProfileData={loggedProfileData} />
          </>
        )}
        <FeedWidget
          queryKey="akasha-beam-page-query"
          itemType={EntityTypes.REFLECT}
          beamId={beamId}
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
