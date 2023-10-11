import React from 'react';
import routes, { REFLECT } from '../../routes';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import { EntityTypes, IPublishData, Profile } from '@akashaorg/typings/lib/ui';
import { useMutationsListener } from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';

export type PendingReflectProps = {
  postId: string;
  loggedProfileData: Profile;
  commentIds: string[];
};

export function PendingReflect({ postId, commentIds }: PendingReflectProps) {
  const { t } = useTranslation('app-akasha-integration');
  const { mutations: pendingReflectStates } = useMutationsListener<
    IPublishData & { postID: string }
  >(['PUBLISH_PENDING_KEY']);

  return (
    <>
      {pendingReflectStates?.map(
        pendingReflectState =>
          pendingReflectState &&
          (pendingReflectState.state.status === 'loading' ||
            /*The following line ensures that even if the reflect is published pending reflect UI should be shown till the new entry appears in the feed */
            (pendingReflectState.state.status === 'success' &&
              !commentIds.includes(pendingReflectState.state.data.toString()))) &&
          pendingReflectState.state.variables.postID === postId && (
            <Stack
              customStyle={`px-4 border border(grey8 dark:grey3) bg-secondaryLight/30`}
              data-testid="pending-entry"
              key={pendingReflectState.mutationId}
            >
              <EntryCard
                // @TODO: Fix createPendingEntry method
                entryData={null}
                authorProfile={null} //createPendingEntry(loggedProfileData, pendingReflectState.state.variables)}
                slateContent={null}
                itemType={EntityTypes.REFLECT}
                flagAsLabel={t('Report Comment')}
                locale={'en'}
                profileAnchorLink={'/profile'}
                repliesAnchorLink={routes[REFLECT]}
                contentClickable={false}
                hidePublishTime={true}
                disableActions={true}
                hideActionButtons={true}
              />
            </Stack>
          ),
      )}
    </>
  );
}
