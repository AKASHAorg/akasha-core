import * as React from 'react';
import { EntityTypes, RootExtensionProps } from '@akashaorg/typings/ui';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { ReplyEditor } from './reply-editor';
import { PostEditor } from './post-editor';

export const InlineEditor = (props: Partial<RootExtensionProps>) => {
  const loginQuery = useGetLogin();
  const action = props.extensionData.action;
  const entryId = props.extensionData.entryId;
  const entryType = props.extensionData.entryType;

  /*ReplyEditor handles reply to a comment and editing a comment*/
  if (entryType === EntityTypes.COMMENT && entryId && (action === 'reply' || action === 'edit')) {
    return <ReplyEditor commentId={entryId} singleSpa={props.singleSpa} action={action} />;
  }

  /*PostEditor handles reply to a post, repost, and editing a post*/
  if (
    action === 'post' ||
    (entryType === EntityTypes.ENTRY &&
      entryId &&
      (action === 'repost' || action === 'edit' || action === 'reply'))
  ) {
    return (
      <PostEditor
        postId={entryId}
        pubKey={loginQuery?.data?.pubKey}
        singleSpa={props.singleSpa}
        action={action}
      />
    );
  }

  throw new Error('Unknown action used');
};
