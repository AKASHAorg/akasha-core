import React from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';
import BackToOriginalBeam from '@akashaorg/ui-lib-feed/lib/components/back-to-orignal-beam';
import EntrySectionLoading from './entry-section-loading';
import ReflectionSection from './reflection-section';
import { useParams } from 'react-router-dom';
import {
  useGetMyProfileQuery,
  useGetReflectionByIdQuery,
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

const ReflectionPage: React.FC<unknown> = () => {
  const { reflectionId } = useParams<{
    reflectionId: string;
  }>();
  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin, navigateToModal } = useRootComponentProps();
  const reflectionReq = useGetReflectionByIdQuery(
    { id: reflectionId },
    { select: response => response.node },
  );
  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });

  const [analyticsActions] = useAnalytics();

  const loggedProfileData = profileDataReq.data;
  const entryData =
    reflectionReq.data && hasOwn(reflectionReq.data, 'id') ? reflectionReq.data : null;

  const showLoginModal = () => {
    navigateToModal({ name: 'login' });
  };

  const onNavigate = useEntryNavigation(getRoutingPlugin().navigateTo);

  if (reflectionReq.status === 'error')
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading the entry')}
        details={t('We cannot show this entry right now')}
        devDetails={reflectionReq.error as string}
      />
    );

  if (reflectionReq.status === 'loading') return <EntrySectionLoading />;

  return (
    <Card padding="p-0" margin="mb-4">
      <BackToOriginalBeam
        label={t('Back to original beam')}
        onClick={() =>
          onNavigate({ authorId: entryData?.author?.id, id: entryData.beam?.id }, EntityTypes.BEAM)
        }
      />
      <ReflectionSection
        beamId={entryData.beam?.id}
        reflectionId={entryData.id}
        entryData={{ ...entryData, beam: null, beamID: entryData.beam?.id }}
        isLoggedIn={!!loggedProfileData?.id}
        onNavigate={onNavigate}
        showLoginModal={showLoginModal}
      />
      <PendingReflect beamId={entryData.beam?.id} loggedProfileData={loggedProfileData} />
      <Stack spacing="gap-y-2">
        {/*<FeedWidget*/}
        {/*  queryKey="akasha-reflection-page-query"*/}
        {/*  itemType={EntityTypes.REFLECT}*/}
        {/*  reflectionsOf={{ reflectionId: entryData.id, itemType: EntityTypes.REFLECT }}*/}
        {/*  loggedProfileData={loggedProfileData}*/}
        {/*  onEntryFlag={() => {*/}
        {/*    return () => {*/}
        {/*      //@TODO*/}
        {/*    };*/}
        {/*  }}*/}
        {/*  onEntryRemove={() => {*/}
        {/*    //@TODO*/}
        {/*  }}*/}
        {/*  itemSpacing={0}*/}
        {/*  newItemsPublishedLabel={t('New Reflects published recently')}*/}
        {/*  onLoginModalOpen={showLoginModal}*/}
        {/*  trackEvent={analyticsActions.trackEvent}*/}
        {/*  onNavigate={onNavigate}*/}
        {/*/>*/}
      </Stack>
    </Card>
  );
};

export default ReflectionPage;
