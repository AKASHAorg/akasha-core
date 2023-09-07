import * as React from 'react';
import BaseEntryPage from './common/base-page';
import { useParams } from 'react-router-dom';
import { ModalNavigationOptions, EntityTypes } from '@akashaorg/typings/ui';
import { useDummyQuery } from '@akashaorg/ui-awf-hooks';

export type PostPageProps = {
  userId?: string;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const PostPage: React.FC<PostPageProps> = props => {
  const { showLoginModal } = props;

  const { postId } = useParams<{
    postId: string;
  }>();
  // @TODO replace with new hooks
  const postReq = useDummyQuery({});

  return (
    <BaseEntryPage
      showLoginModal={showLoginModal}
      feedQueryKey="akasha-beam-page-query"
      postId={postId}
      itemType={EntityTypes.BEAM}
      entryReq={postReq}
    />
  );
};

export default PostPage;
