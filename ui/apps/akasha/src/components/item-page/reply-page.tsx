import * as React from 'react';
import BaseEntryPage from './common/base-page';
import { useParams } from 'react-router-dom';
import { LoginState, mapEntry, useComment } from '@akashaorg/ui-awf-hooks';
import { EntityTypes, ModalNavigationOptions, RootComponentProps } from '@akashaorg/typings/ui';

type ReplyPageProps = {
  loginState?: LoginState;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const ReplyPage: React.FC<ReplyPageProps & RootComponentProps> = props => {
  const { commentId } = useParams<{ commentId: string }>();
  const comment = useComment(commentId, !!commentId);

  const entryData = React.useMemo(() => {
    if (comment.data) {
      return mapEntry(comment.data);
    }
    return undefined;
  }, [comment.data]);

  return (
    <BaseEntryPage
      {...props}
      postId={!!entryData && 'postId' in entryData && entryData?.postId}
      commentId={commentId}
      itemType={EntityTypes.REPLY}
      entryData={entryData}
      entryReq={comment}
    />
  );
};

export default ReplyPage;
