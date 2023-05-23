import * as React from 'react';
import BaseEntryPage from './common/base-page';
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
  // @TODO replace with new hooks
  const postReq = usePost({
    postId,
    loggedUser: loginState?.pubKey,
    enabler: loginState?.fromCache,
  });

  const entryData = React.useMemo(() => {
    if (postReq.data) {
      return mapEntry(postReq.data);
    }
    return undefined;
  }, [postReq.data]);

  return (
    <BaseEntryPage
      {...props}
      postId={postId}
      itemType={EntityTypes.POST}
      // @TODO replace with real data after hooks
      entryData={null}
      entryReq={postReq}
    />
  );
};

export default PostPage;
