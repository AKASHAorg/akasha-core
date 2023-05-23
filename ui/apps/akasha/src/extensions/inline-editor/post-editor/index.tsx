import * as React from 'react';
import DS from '@akashaorg/design-system';
import {
  RootExtensionProps,
  IPublishData,
  AnalyticsCategories,
  IEntryData,
} from '@akashaorg/typings/ui';
import isEqual from 'lodash.isequal';
import {
  useCreatePost,
  useEditPost,
  usePost,
  mapEntry,
  useAnalytics,
  useCreateComment,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { Base } from '../base';
import { Draft, IDraftStorage } from '../utils';
import { editorDefaultValue } from '@akashaorg/design-system/lib/components/Editor/initialValue';

const { EntryCardLoading } = DS;

type Props = {
  appName: string;
  postId: string;
  pubKey: string;
  singleSpa: RootExtensionProps['singleSpa'];
  action: 'post' | 'reply' | 'repost' | 'edit';
  draftStorage: IDraftStorage;
};

export function PostEditor({ appName, postId, pubKey, singleSpa, action, draftStorage }: Props) {
  const { t } = useTranslation('app-akasha-integration');
  const [analyticsActions] = useAnalytics();

  // @TODO replace with new hooks
  const post = usePost({
    postId,
    enabler: action !== 'post',
  });
  const editPost = useEditPost();
  const publishPost = useCreatePost();
  const publishComment = useCreateComment();

  const postDraft = new Draft<Partial<IEntryData>>({
    storage: draftStorage,
    appName,
    pubKey,
    action: 'post',
  });
  const repostDraft = new Draft<IEntryData>({
    storage: draftStorage,
    appName,
    pubKey,
    action: 'repost',
  });
  const canSaveDraft = action === 'post' || action === 'repost';
  const draftPostData = canSaveDraft ? postDraft.get() : null;
  const draftRepostData = canSaveDraft ? repostDraft.get() : null;

  const entryData = React.useMemo(() => {
    if (post.status === 'success') {
      return mapEntry(post.data);
    }
    return undefined;
  }, [post.data, post.status]);

  const embedEntryData = React.useMemo(() => {
    if (entryData && action === 'repost') {
      return entryData;
    }
    if (action === 'repost' || action === 'edit') {
      if (post.data?.quotes.length) {
        return mapEntry(post.data?.quotes[0]);
      }
    }
    return undefined;
  }, [action, entryData, post.data?.quotes]);

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
      switch (action) {
        case 'edit':
          editPost.mutate(
            { entryID: postId, ...data },
            {
              onSuccess: () => {
                analyticsActions.trackEvent({
                  category: AnalyticsCategories.POST,
                  action: 'Post Edited',
                });
              },
            },
          );
          singleSpa.navigateToUrl(location.pathname);
          break;
        case 'post':
        case 'repost':
          publishPost.mutate(
            { ...data, pubKey },
            {
              onSuccess: () => {
                analyticsActions.trackEvent({
                  category: AnalyticsCategories.POST,
                  action: `${action === 'repost' ? 'Repost' : 'New Post'} Published`,
                });
              },
            },
          );
          break;
        case 'reply':
          publishComment.mutate(
            {
              ...data,
              postID: postId,
            },
            {
              onSuccess: () => {
                analyticsActions.trackEvent({
                  category: AnalyticsCategories.REPLY,
                  action: 'Reply Published',
                });
              },
            },
          );
          singleSpa.navigateToUrl(location.pathname);
      }
    },
    [action, postId, pubKey, singleSpa, editPost, publishPost, publishComment, analyticsActions],
  );

  const entryAuthorName =
    entryData?.author?.name || entryData?.author?.userName || entryData?.author?.ethAddress;

  if (post.error) return <>Error loading {action === 'repost' && 'embedded'} post</>;

  if (post.status === 'loading') return <EntryCardLoading />;

  return (
    <Base
      postLabel={
        action === 'edit' ? t('Save Changes') : action === 'reply' ? t('Reply') : t('Publish')
      }
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
        if (canSaveDraft) {
          if (isEqual(value, editorDefaultValue)) {
            postDraft.clear();
            return;
          }
          postDraft.save({ ...postDraft.get(), slateContent: value });
        }
        setEditorState(value);
      }}
      onClear={() => {
        postDraft.clear();
        repostDraft.clear();
        setEmbededEntry(null);
        setEditorState(editorDefaultValue);
      }}
      noBorderRound={action === 'edit'}
      borderBottomOnly={action === 'edit'}
    />
  );
}
