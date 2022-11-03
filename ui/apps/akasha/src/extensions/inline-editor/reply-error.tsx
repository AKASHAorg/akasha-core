import * as React from 'react';
import DS from '@akashaorg/design-system';

import { IEntryData, IPublishData } from '@akashaorg/typings/ui';
import { createPendingEntry, useMutationListener, useGetProfile } from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import routes, { POST } from '../../routes';
import { PUBLISH_PENDING_KEY } from '@akashaorg/ui-awf-hooks/lib/use-comments';

const { EntryBox } = DS;

export interface IReplyErrorState {
  state: 'error' | 'retry';
  content?: IEntryData['slateContent'];
}

type Props = {
  postId: string;
  pubKey: string;
  onChange?: (props: IReplyErrorState) => void;
};

export function ReplyError({ postId, pubKey, onChange }: Props) {
  const { t } = useTranslation('app-akasha-integration');
  const { mutation: publishCommentMutation, clear } = useMutationListener<
    IPublishData & { postID: string }
  >(PUBLISH_PENDING_KEY);

  const profileDataReq = useGetProfile(pubKey);
  /* @Todo: fix my type ;/ */
  const loggedProfileData: any = profileDataReq.data;

  React.useEffect(() => {
    if (publishCommentMutation && publishCommentMutation.state.status === 'error') {
      onChange({ state: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishCommentMutation]);

  const entryData = React.useMemo(
    () =>
      publishCommentMutation &&
      publishCommentMutation.state.status === 'error' &&
      publishCommentMutation.state.variables.postID === postId
        ? createPendingEntry(loggedProfileData, publishCommentMutation.state.variables)
        : null,
    [publishCommentMutation, loggedProfileData, postId],
  );

  return (
    <>
      {entryData && (
        <EntryBox
          /* @Todo: Fix my type */
          entryData={
            createPendingEntry(loggedProfileData, publishCommentMutation.state.variables) as any
          }
          repliesLabel={t('Replies')}
          repostsLabel={t('Reposts')}
          locale={'en'}
          showMore={true}
          profileAnchorLink={'/profile'}
          repliesAnchorLink={routes[POST]}
          contentClickable={false}
          hidePublishTime={true}
          disableActions={true}
          hideActionButtons={true}
          modalSlotId={null}
          error="Oops! Something went wrong."
          onRetry={() => {
            clear();
            onChange({ state: 'retry', content: entryData.slateContent });
          }}
        />
      )}
    </>
  );
}
