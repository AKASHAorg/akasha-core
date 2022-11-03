import * as React from 'react';
import BaseEntryPage from './common/base-entry-page';
import { useParams } from 'react-router-dom';
import { RootComponentProps, ModalNavigationOptions, EntityTypes } from '@akashaorg/typings/ui';
import { LoginState, usePost, mapEntry } from '@akashaorg/ui-awf-hooks';

type PostPageProps = {
  loginState?: LoginState;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const PostPage: React.FC<PostPageProps & RootComponentProps> = props => {
  const { loginState } = props;

  const { postId } = useParams<{ postId: string }>();

  const postReq = usePost({
    postId,
    loggedUser: loginState?.pubKey,
    enabler: loginState?.fromCache,
  });
  /* @Todo: fix my type ;/ */
  const entryData: any = React.useMemo(() => {
    if (postReq.data) {
      return mapEntry(postReq.data);
    }
    return undefined;
  }, [postReq.data]);

  return (
    <BaseEntryPage
      {...props}
      postId={postId}
      entryType={EntityTypes.ENTRY}
      entryData={entryData}
      entryReq={postReq}
    />
  );
};

export default PostPage;
