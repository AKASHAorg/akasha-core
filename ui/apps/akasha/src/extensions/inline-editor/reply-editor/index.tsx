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
import { IReplyErrorState, ReplyError } from '../reply-error';
const { EntryCardLoading } = DS;

type Props = {
  postId: string;
  commentId: string;
  pubKey: string;
  singleSpa: RootExtensionProps['singleSpa'];
  action: 'reply' | 'edit';
};

export function ReplyEditor({ postId, commentId, pubKey, singleSpa, action }: Props) {
  const { t } = useTranslation('app-akasha-integration');
  const [analyticsActions] = useAnalytics();
  const comment = useComment(commentId, true);
  const editComment = useEditComment(commentId, true);
  const publishComment = useCreateComment();
  const [replyState, setReplyState] = React.useState<IReplyErrorState>();

  /*@Todo: fix my type */
  const entryData: any = React.useMemo(() => {
    if (comment.status === 'success') {
      /*@Todo: fix my type */
      return mapEntry(comment.data as any);
    }
    return undefined;
  }, [comment.data, comment.status]);

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
                  action: 'Reply Published',
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

  if (comment.error) return <>Error loading comment</>;

  if (comment.status === 'loading') return <EntryCardLoading />;

  return (
    <>
      {(!replyState || replyState.state === 'retry') && (
        <Base
          postLabel={action === 'edit' ? t('Save Changes') : t('Reply')}
          placeholderLabel={`${t('Reply to')} ${entryAuthorName || ''}`}
          onPublish={handlePublish}
          onPlaceholderClick={handlePlaceholderClick}
          singleSpa={singleSpa}
          editorState={
            replyState && replyState.state === 'retry'
              ? replyState.content
              : action === 'edit'
              ? entryData?.slateContent
              : null
          }
          entryData={entryData}
          isShown={true}
          showCancelButton={action === 'edit'}
        />
      )}
      {action === 'reply' && (
        <ReplyError
          postId={postId}
          pubKey={pubKey}
          onChange={({ state, content }) => {
            switch (state) {
              case 'error':
                setReplyState({ state });
                break;
              case 'retry':
                setReplyState({ state, content });
                break;
            }
          }}
        />
      )}
    </>
  );
}
