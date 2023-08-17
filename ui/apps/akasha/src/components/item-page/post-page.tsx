import * as React from 'react';
import BaseEntryPage from './common/base-page';
import { useParams } from 'react-router-dom';
import { RootComponentProps, ModalNavigationOptions, EntityTypes } from '@akashaorg/typings/ui';

type PostPageProps = {
  userId?: string;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const PostPage: React.FC<PostPageProps & RootComponentProps> = props => {
  const { userId } = props;

  const { postId } = useParams<{ postId: string }>();
  // @TODO replace with new hooks
  const postReq = undefined;
  const entryData = React.useMemo(() => {
    return undefined;
  }, []);

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
