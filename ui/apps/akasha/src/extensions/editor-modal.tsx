import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
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
} from '@akashaproject/ui-awf-hooks';

import { I18nextProvider, useTranslation } from 'react-i18next';
import { IPublishData } from '@akashaproject/ui-awf-typings/lib/entry';
import i18next, { setupI18next } from '../i18n';

const {
  EditorModal,
  ModalContainer,
  ModalCard,
  Spinner,
  ThemeSelector,
  ErrorLoader,
  lightTheme,
  darkTheme,
} = DS;

const EditorModalContainer = (props: RootComponentProps) => {
  const { t } = useTranslation();

  const loginQuery = useGetLogin();
  const [mentionQuery, setMentionQuery] = React.useState(null);
  const [tagQuery, setTagQuery] = React.useState(null);
  const mentionSearch = useMentionSearch(mentionQuery);
  const tagSearch = useTagSearch(tagQuery);

  const profileDataReq = useGetProfile(loginQuery.data?.pubKey);

  // const [mentionsState, mentionsActions] = useMentions({});
  const isEditing = React.useMemo(
    () => props.activeModal.hasOwnProperty('entryId') && props.activeModal.action === 'edit',
    [props.activeModal],
  );

  const hasEmbed = React.useMemo(
    () => props.activeModal.hasOwnProperty('embedEntry'),
    [props.activeModal],
  );
  const embedEntryId = React.useMemo(() => {
    if (
      props.activeModal.hasOwnProperty('embedEntry') &&
      typeof props.activeModal.embedEntry === 'string'
    ) {
      return props.activeModal.embedEntry;
    }
  }, [props.activeModal]);

  const disablePublishing = React.useMemo(
    () => loginQuery.data.waitForAuth || !loginQuery.data.isReady,
    [loginQuery.data],
  );

  const embeddedPost = usePost({ postId: embedEntryId, enabler: hasEmbed });

  const editingPost = usePost({ postId: props.activeModal.entryId, enabler: isEditing });

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
        editPost.mutate({ entryID: props.activeModal.entryId, ...data });
      } else {
        publishPost.mutate({ ...data, pubKey: profileDataReq.data.pubKey });
      }
      props.singleSpa.navigateToUrl(location.pathname);
    },
    [isEditing, props.activeModal, props.singleSpa, editPost, publishPost, profileDataReq.data],
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
    (props.activeModal.embedEntry && embeddedPost.isLoading)
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

const Wrapped = (props: RootComponentProps) => {
  return (
    <I18nextProvider i18n={i18next}>
      <EditorModalContainer {...props} />
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Wrapped),
  errorBoundary: (err, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return (
      <ThemeSelector
        availableThemes={[lightTheme, darkTheme]}
        settings={{ activeTheme: 'LightTheme' }}
      >
        <ModalContainer>
          <ErrorLoader type="script-error" title="Error in editor modal" details={err.message} />
        </ModalContainer>
      </ThemeSelector>
    );
  },
});

export const bootstrap = (props: RootComponentProps) => {
  return setupI18next({
    logger: props.logger,
    // must be the same as the one in ../../i18next.parser.config.js
    namespace: 'app-akasha-integration',
  });
};

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
