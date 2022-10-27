import * as React from 'react';
import DS from '@akashaorg/design-system';
import { RootExtensionProps, IPublishData, AnalyticsCategories } from '@akashaorg/typings/ui';
import {
  useEditComment,
  mapEntry,
  useAnalytics,
  useComment,
  useCreateComment,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { Base } from '../base';
const { EntryCardLoading } = DS;

type Props = {
  postId: string;
  commentId: string;
  singleSpa: RootExtensionProps['singleSpa'];
  action: 'reply' | 'repost' | 'edit';
};

export function ReplyEditor({ postId, commentId, singleSpa, action }: Props) {
  const { t } = useTranslation('app-akasha-integration');
  const [analyticsActions] = useAnalytics();
  const comment = useComment(commentId, true);
  const editComment = useEditComment(commentId, true);
  const publishComment = useCreateComment();

  const entryData = React.useMemo(() => {
    if (comment.status === 'success') {
      return mapEntry(comment.data);
    }
    return undefined;
  }, [comment.data, comment.status]);

  const embedEntryData = action === 'repost' ? entryData : undefined;

  const handlePublish = React.useCallback(
    (data: IPublishData) => {
      switch (action) {
        case 'edit':
          editComment.mutate(
            { ...data, postID: postId },
            {
              onSuccess: () => {
                analyticsActions.trackEvent({
                  category: AnalyticsCategories.REPLY,
                  action: 'Reply Edited',
                });
              },
            },
          );
          break;
        case 'reply':
        case 'repost':
          publishComment.mutate(
            {
              ...data,
              postID: postId,
              replyTo: commentId,
            },
            {
              onSuccess: () => {
                analyticsActions.trackEvent({
                  category: AnalyticsCategories.REPLY,
                  action: `${action === 'repost' ? 'Reply Repost' : 'Reply'} Published`,
                });
              },
            },
          );
          break;
      }

      singleSpa.navigateToUrl(location.pathname);
    },
    [action, postId, commentId, singleSpa, editComment, publishComment, analyticsActions],
  );

  const handlePlaceholderClick = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.POST,
      action: 'Reply Placeholder Clicked',
    });
  };

  const entryAuthorName =
    entryData?.author?.name || entryData?.author?.userName || entryData?.author?.ethAddress;

  if (comment.error) return <>Error loading {action === 'repost' && 'embedded'} comment</>;

  if (comment.status === 'loading') return <EntryCardLoading />;

  return (
    <Base
      postLabel={action === 'edit' ? t('Save Changes') : t('Reply')}
      placeholderLabel={`${t('Reply to')} ${entryAuthorName || ''}`}
      onPublish={handlePublish}
      onPlaceholderClick={handlePlaceholderClick}
      singleSpa={singleSpa}
      embedEntryData={embedEntryData}
      editorState={action === 'edit' ? entryData?.slateContent : null}
      entryData={entryData}
      isShown={true}
      showCancelButton={action === 'edit'}
    />
  );
}
