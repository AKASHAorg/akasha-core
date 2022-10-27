import * as React from 'react';
import { RootExtensionProps } from '@akashaorg/typings/ui';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { ReplyEditor } from './reply-editor';
import { PostEditor } from './post-editor';

export const InlineEditor = (props: Partial<RootExtensionProps>) => {
  const loginQuery = useGetLogin();

  const action = props.extensionData.action;
  const entryId = props.extensionData.entryId;
  const commentId = props.extensionData.commentId;

  if (commentId && entryId && (action === 'reply' || action === 'edit' || action === 'repost'))
    return (
      <ReplyEditor
        postId={entryId}
        commentId={commentId}
        singleSpa={props.singleSpa}
        action={action}
      />
    );

  if (
    action === 'post' ||
    (entryId && (action === 'repost' || action === 'edit' || action === 'reply'))
  )
    return (
      <PostEditor
        postId={entryId}
        pubKey={loginQuery?.data?.pubKey}
        singleSpa={props.singleSpa}
        action={action}
      />
    );

  throw new Error('Unknown action used');
};
