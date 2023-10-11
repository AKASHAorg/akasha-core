import * as React from 'react';
import { EntityTypes, RootExtensionProps } from '@akashaorg/typings/lib/ui';
import { useLoggedIn } from '@akashaorg/ui-awf-hooks';
import { ReplyEditor } from './reply-editor';
import { PostEditor } from './post-editor';
import { IDraftStorage } from './utils';

export type InlineEditorExtensionData = {
  action: 'reply' | 'edit' | 'post' | 'repost';
  itemId: string;
  itemType: EntityTypes;
};

export const InlineEditor = (
  props: Partial<RootExtensionProps<InlineEditorExtensionData>> & { draftStorage?: IDraftStorage },
) => {
  const { extensionData, worldConfig, singleSpa } = props;
  const { loggedInProfileId } = useLoggedIn();
  const { action, itemId, itemType } = extensionData;
  const draftStorage = props.draftStorage || localStorage;

  /*ReplyEditor handles reply to a comment and editing a comment*/
  if (itemType === EntityTypes.REFLECT && itemId && (action === 'reply' || action === 'edit')) {
    return <ReplyEditor commentId={itemId} singleSpa={singleSpa} action={action} />;
  }

  /*PostEditor handles reply to a post, repost, and editing a post*/
  if (
    action === 'post' ||
    (itemType === EntityTypes.BEAM &&
      itemId &&
      (action === 'repost' || action === 'edit' || action === 'reply'))
  ) {
    return (
      <PostEditor
        appName={worldConfig?.homepageApp || 'inline-editor'}
        postId={itemId}
        userId={loggedInProfileId}
        singleSpa={singleSpa}
        action={action}
        draftStorage={draftStorage}
      />
    );
  }

  throw new Error('Unknown action used');
};
