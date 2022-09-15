import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootExtensionProps, IPublishData, AnalyticsCategories } from '@akashaorg/typings/ui';
import DS from '@akashaorg/design-system';
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
} from '@akashaorg/ui-awf-hooks';
import { I18nextProvider, useTranslation } from 'react-i18next';

const { EditorModal, ModalContainer, ModalCard, Spinner, ErrorLoader } = DS;

const EditorModalContainer = (props: RootExtensionProps) => {
  const { t } = useTranslation('app-akasha-integration');

  const loginQuery = useGetLogin();
  const [mentionQuery, setMentionQuery] = React.useState(null);
  const [tagQuery, setTagQuery] = React.useState(null);
  const mentionSearch = useMentionSearch(mentionQuery);
  const tagSearch = useTagSearch(tagQuery);
  const [analyticsActions] = useAnalytics();

  const profileDataReq = useGetProfile(loginQuery.data?.pubKey);

  const isEditing = React.useMemo(
    () => props.extensionData.hasOwnProperty('entryId') && props.extensionData.action === 'edit',
    [props.extensionData],
  );

  const hasEmbed = React.useMemo(
    () => props.extensionData.hasOwnProperty('embedEntry'),
    [props.extensionData],
  );

  const embedEntryId = React.useMemo(() => {
    if (
      props.extensionData.hasOwnProperty('embedEntry') &&
      typeof props.extensionData.embedEntry === 'string'
    ) {
      return props.extensionData.embedEntry;
    }
  }, [props.extensionData]);

  const disablePublishing = React.useMemo(
    () => loginQuery.data.waitForAuth || !loginQuery.data.isReady,
    [loginQuery.data],
  );

  const embeddedPost = usePost({ postId: embedEntryId, enabler: hasEmbed });

  const editingPost = usePost({ postId: props.extensionData.entryId, enabler: isEditing });

  const editPost = useEditPost();

  const publishPost = useCreatePost();

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

  const handleEntryPublish = React.useCallback(
    (data: IPublishData) => {
      if (!profileDataReq.data) {
        return;
      }
      if (isEditing) {
        analyticsActions.trackEvent({
          category: AnalyticsCategories.POST,
          action: 'Post Edited',
        });
        editPost.mutate({ entryID: props.extensionData.entryId, ...data });
      } else {
        analyticsActions.trackEvent({
          category: AnalyticsCategories.POST,
          action: `${hasEmbed ? 'Repost' : 'New Post'} Published`,
        });
        publishPost.mutate({ ...data, pubKey: profileDataReq.data.pubKey });
      }
      props.singleSpa.navigateToUrl(location.pathname);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isEditing,
      props.extensionData,
      props.singleSpa,
      editPost,
      publishPost,
      profileDataReq.data,
      analyticsActions,
    ],
  );

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  const handleMentionQueryChange = (query: string) => {
    setMentionQuery(query);
  };

  const handleTagQueryChange = (query: string) => {
    setTagQuery(query);
  };

  if (
    (isEditing && editingPost.isLoading) ||
    (props.extensionData.embedEntry && embeddedPost.isLoading)
  ) {
    return <>{t('Loading Editor')}</>;
  }
  return (
    <>
      {profileDataReq.status === 'error' && <>Error occured</>}
      {embeddedPost.status === 'error' && <>Error loading embedded content..</>}
      {editingPost.status === 'error' && <>Error loading post</>}

      {(profileDataReq.status === 'loading' ||
        embeddedPost.status === 'loading' ||
        editingPost.status === 'loading') && (
        <ModalContainer>
          <ModalCard>
            <Spinner />
          </ModalCard>
        </ModalContainer>
      )}

      {(!editingPost.isLoading || !embeddedPost.isLoading) &&
        profileDataReq.status === 'success' && (
          <EditorModal
            titleLabel={isEditing ? t('Edit Post') : t('New Post')}
            avatar={profileDataReq.data?.avatar}
            ethAddress={loginQuery.data?.ethAddress}
            postLabel={isEditing ? t('Save Changes') : t('Publish')}
            placeholderLabel={t('Write something')}
            emojiPlaceholderLabel={t('Search')}
            discardPostLabel={t('Discard Post')}
            discardPostInfoLabel={t(
              "You have not posted yet. If you leave now you'll discard your post.",
            )}
            disablePublishLabel={t('Authenticating')}
            keepEditingLabel={t('Keep Editing')}
            disablePublish={disablePublishing}
            onPublish={handleEntryPublish}
            handleNavigateBack={handleModalClose}
            linkPreview={entryData?.linkPreview}
            uploadedImages={entryData?.images}
            getLinkPreview={getLinkPreview}
            getMentions={handleMentionQueryChange}
            getTags={handleTagQueryChange}
            tags={tagSearch.data}
            mentions={mentionSearch.data}
            uploadRequest={uploadMediaToTextile}
            embedEntryData={embedEntryData}
            style={{ width: '36rem' }}
            editorState={entryData?.slateContent}
          />
        )}
    </>
  );
};

const Wrapped = (props: RootExtensionProps) => {
  return (
    <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
      <EditorModalContainer {...props} />
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
        <ModalContainer>
          <ErrorLoader type="script-error" title="Error in editor modal" details={err.message} />
        </ModalContainer>
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
