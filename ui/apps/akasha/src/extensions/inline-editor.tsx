import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootExtensionProps, IPublishData, AnalyticsCategories } from '@akashaorg/typings/ui';
import DS from '@akashaorg/design-system';
import routes, { POST } from '../routes';
import {
  uploadMediaToTextile,
  getLinkPreview,
  withProviders,
  useCreatePost,
  useEditPost,
  usePost,
  useTagSearch,
  useMentionSearch,
  mapEntry,
  useGetProfile,
  useGetLogin,
  useAnalytics,
  ThemeWrapper,
  useCreateComment,
  createPendingEntry,
  useIsFollowingMultiple,
  useFollow,
  useUnfollow,
} from '@akashaorg/ui-awf-hooks';
import { I18nextProvider, useTranslation } from 'react-i18next';

const { EntryBox, Box, CommentEditor, EntryCardLoading, ErrorLoader } = DS;

const InlineEditorContainer = (props: RootExtensionProps) => {
  const { t } = useTranslation('app-akasha-integration');

  const loginQuery = useGetLogin();
  const [mentionQuery, setMentionQuery] = React.useState(null);
  const [tagQuery, setTagQuery] = React.useState(null);
  const mentionSearch = useMentionSearch(mentionQuery);
  const tagSearch = useTagSearch(tagQuery);
  const [analyticsActions] = useAnalytics();

  const profileDataReq = useGetProfile(loginQuery.data?.pubKey);
  const loggedProfileData = profileDataReq.data;

  const action = React.useMemo(() => {
    if (props.extensionData.hasOwnProperty('entryId') && props.extensionData.action === 'edit')
      return 'edit';
    if (props.extensionData.action === 'post') return 'post';
    if (props.extensionData.hasOwnProperty('entryId') && props.extensionData.action === 'reply')
      return 'reply';
    if (props.extensionData.hasOwnProperty('embedEntry')) return 'embed';
    return 'unknown';
  }, [props.extensionData]);

  if (action === 'unknown') {
    throw new Error('Unknown action used');
  }

  const hasEmbed = action === 'embed';

  const embedEntryId = React.useMemo(() => {
    if (hasEmbed && typeof props.extensionData.embedEntry === 'string') {
      return props.extensionData.embedEntry;
    }
  }, [props.extensionData, hasEmbed]);

  const disablePublishing = React.useMemo(
    () => loginQuery.data.waitForAuth || !loginQuery.data.isReady,
    [loginQuery.data],
  );

  const embeddedPost = usePost({ postId: embedEntryId, enabler: hasEmbed });
  const editingPost = usePost({ postId: props.extensionData.entryId, enabler: action === 'edit' });
  const editPost = useEditPost();
  const publishPost = useCreatePost();
  const publishComment = useCreateComment();
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const entryData = React.useMemo(() => {
    if (editingPost.status === 'success') {
      return mapEntry(editingPost.data);
    }
    return undefined;
  }, [editingPost.data, editingPost.status]);

  const embedEntryData = React.useMemo(() => {
    if (embeddedPost.status === 'success') {
      return mapEntry(embeddedPost.data);
    }
    if (editingPost.data?.quotes.length) {
      return mapEntry(editingPost.data?.quotes[0]);
    }
    return undefined;
  }, [embeddedPost.status, embeddedPost.data, editingPost.data?.quotes]);

  const entryAuthorName =
    entryData?.author?.name || entryData?.author?.userName || entryData?.author?.ethAddress;

  const isFollowingMultipleReq = useIsFollowingMultiple(profileDataReq?.data?.pubKey, [
    entryData?.author?.pubKey,
  ]);

  const followedProfiles = isFollowingMultipleReq.data;

  const isFollowing = followedProfiles.includes(entryData?.author?.pubKey);

  const handleEntryPublish = React.useCallback(
    (data: IPublishData) => {
      if (!profileDataReq.data) {
        return;
      }
      switch (action) {
        case 'edit':
          editPost.mutate(
            { entryID: props.extensionData.entryId, ...data },
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
                  action: `${hasEmbed ? 'Repost' : 'New Post'} Published`,
                });
              },
            },
          );
          break;
        case 'reply':
          publishComment.mutate(
            { ...data, postID: props.extensionData.entryId },
            {
              onSuccess: () => {
                analyticsActions.trackEvent({
                  category: AnalyticsCategories.POST,
                  action: 'Reply Published',
                });
              },
            },
          );
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

  const handleFollow = () => {
    if (entryData?.author.pubKey) {
      followReq.mutate(entryData?.author.pubKey);
    }
  };

  const handleUnfollow = () => {
    if (entryData.author.pubKey) {
      unfollowReq.mutate(entryData?.author.pubKey);
    }
  };

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

  const commentEditorUi = (
    <CommentEditor
      avatar={profileDataReq.data?.avatar}
      ethAddress={loginQuery.data?.ethAddress}
      postLabel={getPostLabel()}
      placeholderLabel={getPlaceholderLabel()}
      emojiPlaceholderLabel={t('Search')}
      disablePublishLabel={t('Authenticating')}
      disablePublish={disablePublishing}
      onPublish={handleEntryPublish}
      linkPreview={entryData?.linkPreview}
      uploadedImages={entryData?.images}
      getLinkPreview={getLinkPreview}
      getMentions={handleMentionQueryChange}
      getTags={handleTagQueryChange}
      tags={tagSearch.data}
      mentions={mentionSearch.data}
      uploadRequest={uploadMediaToTextile}
      embedEntryData={embedEntryData}
      editorState={action !== 'reply' ? entryData?.slateContent : null}
      onPlaceholderClick={action === 'reply' ? handleReplyPlaceholderClick : null}
      isShown={!!props.extensionData.isShown}
    />
  );

  return (
    <>
      {profileDataReq.status === 'error' && <Box margin="small">Error occured</Box>}
      {embeddedPost.status === 'error' && (
        <Box margin="small">Error loading embedded content..</Box>
      )}
      {editingPost.status === 'error' && <Box margin="small">Error loading post</Box>}

      {(profileDataReq.status === 'loading' ||
        embeddedPost.status === 'loading' ||
        editingPost.status === 'loading') && (
        <Box margin="small">
          <EntryCardLoading />
        </Box>
      )}

      {(!editingPost.isLoading || !embeddedPost.isLoading) &&
        profileDataReq.status === 'success' &&
        (action === 'reply' ? (
          <Box margin="medium" style={{ position: 'relative' }}>
            {commentEditorUi}
          </Box>
        ) : (
          commentEditorUi
        ))}

      {publishComment.isLoading && publishComment.variables.postID === props.extensionData.entryId && (
        <Box
          pad={{ horizontal: 'medium' }}
          border={{ side: 'bottom', size: '1px', color: 'border' }}
          style={{ backgroundColor: '#4e71ff0f' }}
        >
          <EntryBox
            entryData={createPendingEntry(loggedProfileData, publishComment.variables)}
            sharePostLabel={t('Share Post')}
            shareTextLabel={t('Share this post with your friends')}
            repliesLabel={t('Replies')}
            repostsLabel={t('Reposts')}
            repostLabel={t('Repost')}
            repostWithCommentLabel={t('Repost with comment')}
            shareLabel={t('Share')}
            copyLinkLabel={t('Copy Link')}
            flagAsLabel={t('Report Comment')}
            loggedProfileEthAddress={loggedProfileData.ethAddress}
            locale={'en'}
            showMore={true}
            profileAnchorLink={'/profile'}
            repliesAnchorLink={routes[POST]}
            handleFollowAuthor={handleFollow}
            handleUnfollowAuthor={handleUnfollow}
            isFollowingAuthor={isFollowing}
            contentClickable={false}
            hidePublishTime={true}
            disableActions={true}
            hideActionButtons={true}
            modalSlotId={props.layoutConfig.modalSlotId}
          />
        </Box>
      )}
    </>
  );
};

const Wrapped = (props: RootExtensionProps) => {
  return (
    <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
      <InlineEditorContainer {...props} />
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Wrapped),
  renderType: 'createRoot',
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return (
      <ThemeWrapper {...props}>
        <ErrorLoader type="script-error" title="Error in editor modal" details={err.message} />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
