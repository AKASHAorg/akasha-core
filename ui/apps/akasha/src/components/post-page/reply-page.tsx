import * as React from 'react';
import BaseEntryPage from './common/base-entry-page';
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

  /* @Todo: fix my type ;/ */
  const entryData: any = React.useMemo(() => {
    if (comment.data) {
      /*@Todo: fix my type */
      return mapEntry(comment.data as any);
    }
    return undefined;
  }, [comment.data]);

  return (
    <BaseEntryPage
      {...props}
      postId={entryData?.postId}
      commentId={commentId}
      entryType={EntityTypes.COMMENT}
      entryData={entryData}
      entryReq={comment}
    />
  );
};

export default ReplyPage;
