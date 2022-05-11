import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useComment } from '@akashaorg/ui-awf-hooks';
import { POST } from '../../routes';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';

const ReplyPage: React.FC<RootComponentProps> = props => {
  const { commentId } = useParams<{ commentId: string }>();
  const comment = useComment(commentId, !!commentId);
  if (comment?.data?.postId) {
    props.plugins?.routing?.navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes[POST]}/${comment.data.postId}`,
    });
  }

  return <div>Redirecting to the post...</div>;
};

export default ReplyPage;
