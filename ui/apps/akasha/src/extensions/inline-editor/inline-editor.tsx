import * as React from 'react';
import { RootExtensionProps, IPublishData, AnalyticsCategories } from '@akashaorg/typings/ui';
import DS from '@akashaorg/design-system';
import {
  uploadMediaToTextile,
  getLinkPreview,
  useCreatePost,
  useEditPost,
  usePost,
  useTagSearch,
  useMentionSearch,
  mapEntry,
  useGetProfile,
  useGetLogin,
  useAnalytics,
  useCreateComment,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';

const { CommentEditor, EntryCardLoading } = DS;

export const InlineEditor = (props: RootExtensionProps) => {
  const { t } = useTranslation('app-akasha-integration');

  const loginQuery = useGetLogin();
  const [mentionQuery, setMentionQuery] = React.useState(null);
  const [tagQuery, setTagQuery] = React.useState(null);
  const mentionSearch = useMentionSearch(mentionQuery);
  const tagSearch = useTagSearch(tagQuery);
  const [analyticsActions] = useAnalytics();

  const profileDataReq = useGetProfile(loginQuery.data?.pubKey);

  const action = React.useMemo(() => {
    if (props.extensionData.hasOwnProperty('entryId') && props.extensionData.action === 'edit')
      return 'edit';
    if (props.extensionData.action === 'post') return 'post';
    if (props.extensionData.hasOwnProperty('entryId') && props.extensionData.action === 'reply')
      return 'reply';
    if (props.extensionData.hasOwnProperty('entryId') && props.extensionData.action === 'embed')
      return 'embed';
    return 'unknown';
  }, [props.extensionData]);

  if (action === 'unknown') {
    throw new Error('Unknown action used');
  }

  const disablePublishing = React.useMemo(
    () => loginQuery.data.waitForAuth || !loginQuery.data.isReady,
    [loginQuery.data],
  );

  const replyTo =
    typeof props.extensionData.replyTo === 'string' ? props.extensionData.replyTo : '';
  const entryId = props.extensionData.entryId;

  const embeddedPost = usePost({
    postId: entryId,
    enabler: action === 'embed',
  });
  const editingPost = usePost({
    postId: entryId,
    enabler: action === 'edit',
  });
  const editPost = useEditPost();
  const publishPost = useCreatePost();
  const publishComment = useCreateComment();

  const entryData = React.useMemo(() => {
    if (editingPost.status === 'success') {
      return mapEntry(editingPost.data);
    }
    return undefined;
  }, [editingPost.data, editingPost.status]);

  const embedEntryData = React.useMemo(() => {
    if (action === 'embed') {
      if (embeddedPost.status === 'success') {
        return mapEntry(embeddedPost.data);
      }
      if (editingPost.data?.quotes.length) {
        return mapEntry(editingPost.data?.quotes[0]);
      }
    }

    return undefined;
  }, [action, embeddedPost.status, embeddedPost.data, editingPost.data?.quotes]);

  const entryAuthorName =
    entryData?.author?.name || entryData?.author?.userName || entryData?.author?.ethAddress;

  const handleEntryPublish = React.useCallback(
    (data: IPublishData) => {
      if (!profileDataReq.data) {
        return;
      }
      switch (action) {
        case 'edit':
          editPost.mutate(
            { entryID: entryId, ...data },
            {
              onSuccess: () => {
                analyticsActions.trackEvent({
                  category: AnalyticsCategories.POST,
                  action: 'Post Edited',
                });
              },
            },
          );
          break;
        case 'post':
        case 'embed':
          publishPost.mutate(
            { ...data, pubKey: profileDataReq.data.pubKey },
            {
              onSuccess: () => {
                analyticsActions.trackEvent({
                  category: AnalyticsCategories.POST,
                  action: `${action === 'embed' ? 'Repost' : 'New Post'} Published`,
                });
              },
            },
          );
          break;
        case 'reply':
          publishComment.mutate(
            {
              ...data,
              postID: entryId,
              replyTo,
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

      if (action !== 'reply') props.singleSpa.navigateToUrl(location.pathname);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      action,
      props.extensionData,
      props.singleSpa,
      editPost,
      publishPost,
      profileDataReq.data,
      analyticsActions,
    ],
  );

  const handleMentionQueryChange = (query: string) => {
    setMentionQuery(query);
  };

  const handleTagQueryChange = (query: string) => {
    setTagQuery(query);
  };

  if (
    (action === 'edit' && editingPost.isLoading) ||
    (props.extensionData.embedEntry && embeddedPost.isLoading)
  ) {
    return <>{t('Loading Editor')}</>;
  }

  const getPostLabel = () => {
    switch (action) {
      case 'edit':
        return t('Save Changes');
      case 'post':
      case 'embed':
        return t('Publish');
      case 'reply':
        return t('Reply');
    }
  };

  const getPlaceholderLabel = () => {
    switch (action) {
      case 'reply':
        return `${t('Reply to')} ${entryAuthorName || ''}`;
      default:
        return t('Share your thoughts');
    }
  };

  const handleReplyPlaceholderClick = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.POST,
      action: 'Reply Placeholder Clicked',
    });
  };

  return (
    <>
      {profileDataReq.status === 'error' && <>Error occured</>}
      {embeddedPost.status === 'error' && <>Error loading embedded content..</>}
      {editingPost.status === 'error' && <>Error loading post</>}

      {(profileDataReq.status === 'loading' ||
        embeddedPost.status === 'loading' ||
        editingPost.status === 'loading') && <EntryCardLoading />}

      {(!editingPost.isLoading || !embeddedPost.isLoading) &&
        profileDataReq.status === 'success' && (
          <CommentEditor
            avatar={profileDataReq.data?.avatar}
            ethAddress={loginQuery.data?.ethAddress}
            postLabel={getPostLabel()}
            placeholderLabel={getPlaceholderLabel()}
            emojiPlaceholderLabel={t('Search')}
            disablePublishLabel={t('Authenticating')}
            disablePublish={disablePublishing}
            onPublish={handleEntryPublish}
            linkPreview={action === 'edit' ? entryData?.linkPreview : null}
            uploadedImages={action === 'edit' ? entryData?.images : null}
            getLinkPreview={getLinkPreview}
            getMentions={handleMentionQueryChange}
            getTags={handleTagQueryChange}
            tags={tagSearch.data}
            mentions={mentionSearch.data}
            uploadRequest={uploadMediaToTextile}
            embedEntryData={embedEntryData}
            editorState={action === 'edit' ? entryData?.slateContent : null}
            onPlaceholderClick={action === 'reply' ? handleReplyPlaceholderClick : null}
            onCancelClick={() => props.singleSpa.navigateToUrl(location.pathname)}
            cancelButtonLabel={t('Cancel')}
            showCancelButton={action === 'edit'}
            isShown={!!props.extensionData.isShown}
            background="cardBackground"
          />
        )}
    </>
  );
};
