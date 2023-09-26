import * as React from 'react';

import { EntityTypes, IEntryData, IPublishData, Profile } from '@akashaorg/typings/lib/ui';
import { createPendingEntry, useMutationListener } from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import routes, { BEAM } from '../../routes';

import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';

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
        <EntryCard
          // @TODO fix createPendingEntry method
          entryData={null}
          authorProfile={null} //createPendingEntry(loggedProfileData, publishCommentMutation.state.variables)}
          locale={'en'}
          slateContent={null}
          itemType={EntityTypes.REFLECT}
          profileAnchorLink={'/profile'}
          repliesAnchorLink={routes[BEAM]}
          contentClickable={false}
          hidePublishTime={true}
          disableActions={true}
          hideActionButtons={true}
        />
      )}
    </>
  );
}
