import * as React from 'react';
import BaseEntryPage from './common/base-page';
import { useParams } from 'react-router-dom';
import { mapEntry, useComment, useDummyQuery } from '@akashaorg/ui-awf-hooks';
import { EntityTypes, ModalNavigationOptions, RootComponentProps } from '@akashaorg/typings/ui';

type ReplyPageProps = {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const ReplyPage: React.FC<ReplyPageProps & RootComponentProps> = props => {
  const { commentId } = useParams<{ commentId: string }>();

  // @TODO replace with new hooks
  const comment = useDummyQuery(null);

  const entryData = React.useMemo(() => {
    if (comment.data) {
      return mapEntry(comment.data);
    }
    return undefined;
  }, [comment.data]);

  return (
    <BaseEntryPage
      {...props}
      postId={!!entryData && 'postId' in entryData && (entryData?.postId as string)}
      commentId={commentId}
      itemType={EntityTypes.REFLECT}
      entryReq={comment}
      feedQueryKey="akasha-reflect-page-query"
    />
  );
};

export default ReplyPage;
