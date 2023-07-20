import * as React from 'react';
import BaseEntryPage from './common/base-page';
import { useParams } from 'react-router-dom';
import { RootComponentProps, ModalNavigationOptions, EntityTypes } from '@akashaorg/typings/ui';
import { usePost, mapEntry } from '@akashaorg/ui-awf-hooks';

type PostPageProps = {
  userId?: string;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const PostPage: React.FC<PostPageProps & RootComponentProps> = props => {
  const { userId } = props;

  const { postId } = useParams<{ postId: string }>();
  // @TODO replace with new hooks
  const postReq = usePost({
    postId,
    loggedUser: userId,
  });

  const entryData = React.useMemo(
    () => {
      // if (postReq.data) {
      //   return mapEntry(postReq.data);
      // }
      return undefined;
    },
    [
      /*postReq.data*/
    ],
  );

  return (
    <BaseEntryPage
      {...props}
      postId={postId}
      itemType={EntityTypes.BEAM}
      // @TODO replace with real data after hooks
      entryData={null}
      entryReq={postReq}
    />
  );
};

export default PostPage;
