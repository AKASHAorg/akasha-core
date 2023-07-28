import * as React from 'react';
import BaseEntryPage from './common/base-page';
import { useParams } from 'react-router-dom';
import { RootComponentProps, ModalNavigationOptions, EntityTypes } from '@akashaorg/typings/ui';
import { usePost, mapEntry, useDummyQuery } from '@akashaorg/ui-awf-hooks';

type PostPageProps = {
  userId?: string;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const PostPage: React.FC<PostPageProps & RootComponentProps> = props => {
  const { userId } = props;

  const { postId } = useParams<{ postId: string }>();
  // @TODO replace with new hooks
  const postReq = useDummyQuery({});

  return (
    <BaseEntryPage {...props} postId={postId} itemType={EntityTypes.BEAM} entryReq={postReq} />
  );
};

export default PostPage;
