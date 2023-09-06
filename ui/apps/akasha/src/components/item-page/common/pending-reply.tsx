import * as React from 'react';
import { IPublishData, Profile } from '@akashaorg/typings/ui';
import { useMutationsListener } from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import routes, { REFLECT } from '../../../routes';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import EntryBox from '@akashaorg/design-system-components/lib/components/Entry/EntryBox';

export type PendingReplyProps = {
  postId: string;
  loggedProfileData: Profile;
  commentIds: string[];
};

export function PendingReply({ postId, commentIds }: PendingReplyProps) {
  const { t } = useTranslation('app-akasha-integration');
  const { mutations: pendingReplyStates } = useMutationsListener<IPublishData & { postID: string }>(
    ['PUBLISH_PENDING_KEY'],
  );

  return (
    <>
      {pendingReplyStates?.map(
        pendingReplyState =>
          pendingReplyState &&
          (pendingReplyState.state.status === 'loading' ||
            /*The following line ensures that even if the reply is published pending reply UI should be shown till the new entry appears in the feed */
            (pendingReplyState.state.status === 'success' &&
              !commentIds.includes(pendingReplyState.state.data.toString()))) &&
          pendingReplyState.state.variables.postID === postId && (
            <Box
              customStyle={`px-4 border border(grey8 dark:grey3) bg-secondaryLight/30`}
              data-testid="pending-entry"
              key={pendingReplyState.mutationId}
            >
              <EntryBox
                // @TODO: Fix createPendingEntry method
                entryData={null} //createPendingEntry(loggedProfileData, pendingReplyState.state.variables)}
                flagAsLabel={t('Report Comment')}
                locale={'en'}
                showMore={true}
                profileAnchorLink={'/profile'}
                repliesAnchorLink={routes[REFLECT]}
                contentClickable={false}
                hidePublishTime={true}
                disableActions={true}
                hideActionButtons={true}
              />
            </Box>
          ),
      )}
    </>
  );
}
