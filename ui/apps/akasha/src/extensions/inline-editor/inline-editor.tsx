import * as React from 'react';
import { EntityTypes, RootExtensionProps } from '@akashaorg/typings/ui';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { ReplyEditor } from './reply-editor';
import { PostEditor } from './post-editor';
import { IDraftStorage } from './utils';

export const InlineEditor = (
  props: Partial<RootExtensionProps> & { draftStorage?: IDraftStorage },
) => {
  const loginQuery = useGetLogin();
  const action = props.extensionData.action;
  const itemId = props.extensionData.itemId;
  const itemType = props.extensionData.itemType;
  const draftStorage = props.draftStorage || localStorage;

  /*ReplyEditor handles reply to a comment and editing a comment*/
  if (itemType === EntityTypes.REPLY && itemId && (action === 'reply' || action === 'edit')) {
    return <ReplyEditor commentId={itemId} singleSpa={props.singleSpa} action={action} />;
  }

  /*PostEditor handles reply to a post, repost, and editing a post*/
  if (
    action === 'post' ||
    (itemType === EntityTypes.POST &&
      itemId &&
      (action === 'repost' || action === 'edit' || action === 'reply'))
  ) {
    return (
      <PostEditor
        appName={props?.worldConfig?.homepageApp || 'inline-editor'}
        postId={itemId}
        userId={loginQuery?.data?.id}
        singleSpa={props.singleSpa}
        action={action}
        draftStorage={draftStorage}
      />
    );
  }

  throw new Error('Unknown action used');
};
