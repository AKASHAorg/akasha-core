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
  useMutationListener,
  CREATE_POST_MUTATION_KEY,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { Base } from '../base';
import { clearDraftItem, getDraftItem, saveDraftItem } from '../utils';
import { editorDefaultValue } from '@akashaorg/design-system/lib/components/Editor/initialValue';

const { EntryCardLoading } = DS;

type Props = {
  appName: string;
  postId: string;
  pubKey: string;
  singleSpa: RootExtensionProps['singleSpa'];
  action: 'post' | 'reply' | 'repost' | 'edit';
};

export function PostEditor({ appName, postId, pubKey, singleSpa, action }: Props) {
  const { t } = useTranslation('app-akasha-integration');
  const [analyticsActions] = useAnalytics();
  const post = usePost({
    postId,
    enabler: action !== 'post',
  });
  const editPost = useEditPost();
  const publishPost = useCreatePost();
  const publishComment = useCreateComment();
  const { mutation: createPostMutation } =
    useMutationListener<IPublishData>(CREATE_POST_MUTATION_KEY);

  /*@Todo: fix my type */
  const entryData: any = React.useMemo(() => {
    if (post.status === 'success') {
      /*@Todo: fix my type */
      return mapEntry(post.data as any);
    }
    return undefined;
  }, [post.data, post.status]);

  /* @Todo: fix my type ;/ */
  const embedEntryData: any = React.useMemo(() => {
    if (action === 'repost') {
      if (entryData) {
        return entryData;
      }
      if (post.data?.quotes.length) {
        /*@Todo: fix my type */
        return mapEntry(post.data?.quotes[0] as any);
      }
    }

    return undefined;
  }, [action, entryData, post.data?.quotes]);

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

  if (
    post.status === 'loading' ||
    (createPostMutation && createPostMutation.state.status === 'loading' && action === 'repost')
  )
    return <EntryCardLoading />;

  if (createPostMutation && createPostMutation.state.status === 'success' && action === 'repost') {
    singleSpa.navigateToUrl(
      `${window.location.origin}/@akashaorg/app-akasha-integration/post/${createPostMutation.state.data}`,
    );
  }

  const canSaveDraft = action === 'post';

  return (
    <Base
      postLabel={action === 'edit' ? t('Save Changes') : t('Publish')}
      placeholderLabel={
        action === 'reply' ? `${t('Reply to')} ${entryAuthorName || ''}` : t('Share your thoughts')
      }
      onPublish={handlePublish}
      singleSpa={singleSpa}
      embedEntryData={embedEntryData}
      entryData={entryData}
      editorState={
        action === 'edit'
          ? entryData?.slateContent
          : canSaveDraft
          ? getDraftItem({ pubKey, appName })
          : null
      }
      isShown={action !== 'post'}
      showCancelButton={action === 'edit'}
      isReply={action === 'reply'}
      showDraft={canSaveDraft}
      setEditorState={(value: IEntryData['slateContent']) => {
        if (!canSaveDraft) return;
        if (isEqual(value, editorDefaultValue)) {
          clearDraftItem({ pubKey, appName });
          return;
        }
        saveDraftItem({ pubKey, appName, content: value });
      }}
    />
  );
}
