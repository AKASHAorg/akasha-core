import * as React from 'react';

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
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';

type Props = {
  commentId: string;
  singleSpa: RootExtensionProps['singleSpa'];
  action: 'reply' | 'edit';
};

export function ReplyEditor({ commentId, singleSpa, action }: Props) {
  const { t } = useTranslation('app-akasha-integration');
  const [analyticsActions] = useAnalytics();

  // @TODO replace with new hooks
  const comment = useComment(commentId, true);
  const editComment = useEditComment(commentId, true);
  const publishComment = useCreateComment();

  const entryData = React.useMemo(() => {
    if (comment.status === 'success') {
      return mapEntry(comment.data);
    }
    return undefined;
  }, [comment.data, comment.status]);

  const [editorState, setEditorState] = React.useState(
    action === 'edit' ? entryData?.slateContent : null,
  );

  const handlePublish = React.useCallback(
    (data: IPublishData) => {
      switch (action) {
        case 'edit':
          editComment.mutate(
            { ...data, postID: !!entryData && 'postId' in entryData && entryData?.postId },
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
          publishComment.mutate(
            {
              ...data,
              postID: !!entryData && 'postId' in entryData && entryData?.postId,
              replyTo: commentId,
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
          break;
      }

      singleSpa.navigateToUrl(location.pathname);
    },
    [action, entryData, commentId, singleSpa, editComment, publishComment, analyticsActions],
  );

  const handlePlaceholderClick = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.POST,
      action: 'Reply Placeholder Clicked',
    });
  };

  const entryAuthorName =
    entryData?.author?.name || entryData?.author?.userName || entryData?.author?.ethAddress;

  if (comment.error) return <>Error loading comment</>;

  if (comment.status === 'loading') return <EntryCardLoading />;

  return (
    <Base
      postLabel={action === 'edit' ? t('Save Changes') : t('Reply')}
      placeholderLabel={`${t('Reply to')} ${entryAuthorName || ''}`}
      onPublish={handlePublish}
      onPlaceholderClick={handlePlaceholderClick}
      singleSpa={singleSpa}
      editorState={editorState}
      setEditorState={setEditorState}
      // @TODO replace with real data after hook fix
      entryData={null}
      openEditor={true}
      showCancelButton={action === 'edit'}
      isReply={action === 'reply'}
      noBorderRound={action === 'edit'}
      borderBottomOnly={action === 'edit'}
    />
  );
}
