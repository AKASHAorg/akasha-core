import * as React from 'react';

import { IEntryData, IPublishData, Profile } from '@akashaorg/typings/ui';
import { createPendingEntry, useMutationListener } from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import routes, { POST } from '../../routes';
import EntryBox from '@akashaorg/design-system-components/lib/components/Entry/EntryBox';

export interface IReplyErrorState {
  state: 'error' | 'retry';
  content?: IEntryData['slateContent'];
}

type Props = {
  postId: string;
  loggedProfileData: Profile;
  onChange?: (props: IReplyErrorState) => void;
};

export function ReplyError({ postId, loggedProfileData, onChange }: Props) {
  const { t } = useTranslation('app-akasha-integration');
  const { mutation: publishCommentMutation, clear } = useMutationListener<
    IPublishData & { postID: string }
  >(['PUBLISH_PENDING_KEY']);

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
          entryData={createPendingEntry(loggedProfileData, publishCommentMutation.state.variables)}
          locale={'en'}
          showMore={true}
          profileAnchorLink={'/profile'}
          repliesAnchorLink={routes[POST]}
          contentClickable={false}
          hidePublishTime={true}
          disableActions={true}
          hideActionButtons={true}
          error={t('Oops! Something went wrong.')}
          onRetry={() => {
            clear();
            onChange({ state: 'retry', content: entryData.slateContent });
          }}
        />
      )}
    </>
  );
}
