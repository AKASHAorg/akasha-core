import * as React from 'react';
import {
  RootExtensionProps,
  IPublishData,
  AnalyticsCategories,
  IEntryData,
} from '@akashaorg/typings/ui';
import isEqual from 'lodash.isequal';

import { useTranslation } from 'react-i18next';
import { Base } from '../base';
import { Draft, IDraftStorage } from '../utils';
import { editorDefaultValue } from '@akashaorg/design-system-components/lib/components/Editor/initialValue';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import {
  useCreateBeamMutation,
  useCreateContentBlockMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

type Props = {
  appName: string;
  postId: string;
  userId: string;
  singleSpa: RootExtensionProps['singleSpa'];
  action: 'post' | 'reply' | 'repost' | 'edit';
  draftStorage: IDraftStorage;
};

export function PostEditor({ appName, postId, userId, singleSpa, action, draftStorage }: Props) {
  const { t } = useTranslation('app-akasha-integration');
  const [analyticsActions] = [undefined];

  // @TODO replace with new hooks
  const post = undefined;
  const editPost = undefined;
  const editorBlockCreator = useCreateContentBlockMutation();
  const publishPost = useCreateBeamMutation();
  const publishComment = undefined;

  const postDraft = new Draft<Partial<IEntryData>>({
    storage: draftStorage,
    appName,
    userId,
    action: 'post',
  });
  const repostDraft = new Draft<IEntryData>({
    storage: draftStorage,
    appName,
    userId,
    action: 'repost',
  });
  const canSaveDraft = action === 'post' || action === 'repost';
  const draftPostData = canSaveDraft ? postDraft.get() : null;
  const draftRepostData = canSaveDraft ? repostDraft.get() : null;

  const entryData = React.useMemo(() => {
    return undefined;
  }, []);

  const embedEntryData = React.useMemo(() => {
    return undefined;
  }, []);

  const [editorState, setEditorState] = React.useState(
    action === 'edit' ? entryData?.slateContent : draftPostData,
  );
  const [embeddedEntry, setEmbededEntry] = React.useState(
    action === 'repost' ? embedEntryData : draftRepostData,
  );

  const handleSaveImagesDraft = images => {
    const currentDraftPost = postDraft.get();
    const newDraftPost = { ...currentDraftPost, images };
    postDraft.save(newDraftPost);
  };

  const handleSaveLinkPreviewDraft = linkPreview => {
    const currentDraftPost = postDraft.get();
    const newDraftPost = { ...currentDraftPost, linkPreview };
    postDraft.save(newDraftPost);
  };
  // @TODO fix after hooks
  // React.useEffect(() => {
  //   if (action === 'repost') {
  //     repostDraft.save(embedEntryData);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [action, embedEntryData]);

  const handlePublish = React.useCallback(
    (data: IPublishData) => {
      console.log('publish post:', data);
      // switch (action) {
      //   case 'edit':
      //     editPost.mutate(
      //       { entryID: postId, ...data },
      //       {
      //         onSuccess: () => {
      //           analyticsActions.trackEvent({
      //             category: AnalyticsCategories.POST,
      //             action: 'Post Edited',
      //           });
      //         },
      //       },
      //     );
      //     singleSpa.navigateToUrl(location.pathname);
      //     break;
      //   case 'post':
      //   case 'repost':
      //     publishPost.mutate(
      //       { ...data, userId },
      //       {
      //         onSuccess: () => {
      //           analyticsActions.trackEvent({
      //             category: AnalyticsCategories.POST,
      //             action: `${action === 'repost' ? 'Repost' : 'New Post'} Published`,
      //           });
      //         },
      //       },
      //     );
      //     break;
      //   case 'reply':
      //     publishComment.mutate(
      //       {
      //         ...data,
      //         postID: postId,
      //       },
      //       {
      //         onSuccess: () => {
      //           analyticsActions.trackEvent({
      //             category: AnalyticsCategories.REPLY,
      //             action: 'Reply Published',
      //           });
      //         },
      //       },
      //     );
      //     singleSpa.navigateToUrl(location.pathname);
      // }
    },
    [action, postId, userId, singleSpa, editPost, publishPost, publishComment, analyticsActions],
  );

  const entryAuthorName =
    entryData?.author?.name || entryData?.author?.userName || entryData?.author?.ethAddress;

  // if (post.error) return <>Error loading {action === 'repost' && 'embedded'} post</>;
  //
  // if (post.status === 'loading') return <EntryCardLoading />;

  const postLabelAction = React.useMemo(() => {
    switch (action) {
      case 'edit':
        return t('Save Changes');
      case 'reply':
        return t('Reflect');
      default:
        return t('Beam it');
    }
  }, [action]);

  return (
    <Base
      postLabel={postLabelAction}
      placeholderLabel={
        action === 'reply' ? `${t('Reply to')} ${entryAuthorName || ''}` : t('Share your thoughts')
      }
      onPublish={handlePublish}
      singleSpa={singleSpa}
      linkPreview={entryData?.linkPreview || draftPostData?.linkPreview}
      uploadedImages={entryData?.images || draftPostData?.images}
      // @TODO replace with real data after hook fix
      embedEntryData={null}
      entryData={null}
      editorState={editorState}
      openEditor={action === 'edit' || action === 'reply' || !!embeddedEntry || !!draftPostData}
      showCancelButton={action === 'edit'}
      isReply={action === 'reply'}
      showDraft={canSaveDraft}
      handleSaveImagesDraft={handleSaveImagesDraft}
      handleSaveLinkPreviewDraft={handleSaveLinkPreviewDraft}
      setEditorState={(value: IEntryData['slateContent']) => {
        // if (canSaveDraft) {
        //   if (isEqual(value, editorDefaultValue)) {
        //     postDraft.clear();
        //     return;
        //   }
        //   postDraft.save({ ...postDraft.get(), slateContent: value });
        // }
        setEditorState(value);
      }}
      onClear={() => {
        postDraft.clear();
        repostDraft.clear();
        setEmbededEntry(null);
        setEditorState(editorDefaultValue);
      }}
    />
  );
}
