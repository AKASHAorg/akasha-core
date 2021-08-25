import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
import { uploadMediaToTextile } from '@akashaproject/ui-awf-hooks/lib/utils/media-utils';
import { PublishPostData } from '@akashaproject/ui-awf-hooks/lib/use-posts';
import { useMentions, useLoginState, withProviders } from '@akashaproject/ui-awf-hooks';
import { useCreatePost, useEditPost, usePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { mapEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useGetProfile } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
import i18next, { setupI18next } from '../i18n';

const { EditorModal } = DS;

const EditorModalContainer = (props: RootComponentProps) => {
  const { t } = useTranslation();

  const [loginState] = useLoginState({});

  const profileDataReq = useGetProfile(loginState.pubKey);
  const loggedProfileData = profileDataReq.data;

  const [mentionsState, mentionsActions] = useMentions({});
  const isEditing = React.useMemo(
    () => props.activeModal.hasOwnProperty('entryId') && props.activeModal.action === 'edit',
    [props.activeModal],
  );

  const hasEmbed = React.useMemo(
    () => props.activeModal.hasOwnProperty('embedEntry'),
    [props.activeModal],
  );

  const embeddedPost = usePost(props.activeModal.embedEntry, hasEmbed);

  const editingPost = usePost(props.activeModal.entryId, isEditing);

  const editPost = useEditPost();

  const publishPost = useCreatePost();

  const entryData = React.useMemo(() => {
    if (editingPost.status === 'success') {
      return mapEntry(editingPost.data);
    }
    return undefined;
  }, [editingPost.data, editingPost.status]);

  const embeddedEntryContent = React.useMemo(() => {
    if (embeddedPost.status === 'success') {
      return mapEntry(embeddedPost.data).content;
    }
    return undefined;
  }, [embeddedPost.status, embeddedPost.data]);

  const handleEntryPublish = React.useCallback(
    async (data: PublishPostData) => {
      if (isEditing) {
        editPost.mutate({ entryID: props.activeModal.entryId, ...data });
      } else {
        publishPost.mutate({ ...data, pubKey: loggedProfileData.pubKey });
      }
      props.singleSpa.navigateToUrl(location.pathname);
    },
    [isEditing, props.activeModal, props.singleSpa, editPost, publishPost, loggedProfileData],
  );

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  if (isEditing && editingPost.isLoading) {
    return <>{t('Loading Editor')}</>;
  }
  return (
    <>
      {(!editingPost.isLoading || !embeddedPost.isLoading) && (
        <EditorModal
          titleLabel={isEditing ? t('Edit Post') : t('New Post')}
          avatar={loggedProfileData?.avatar}
          ethAddress={loginState.ethAddress}
          postLabel={t('Publish')}
          placeholderLabel={t('Write something')}
          emojiPlaceholderLabel={t('Search')}
          discardPostLabel={t('Discard Post')}
          discardPostInfoLabel={t(
            "You have not posted yet. If you leave now you'll discard your post.",
          )}
          keepEditingLabel={t('Keep Editing')}
          onPublish={handleEntryPublish}
          handleNavigateBack={handleModalClose}
          getMentions={mentionsActions.getMentions}
          getTags={mentionsActions.getTags}
          tags={mentionsState.tags}
          mentions={mentionsState.mentions}
          uploadRequest={uploadMediaToTextile}
          embedEntryData={embeddedEntryContent}
          style={{ width: '36rem' }}
          editorState={entryData?.content}
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
  errorBoundary: (err, errorInfo, props) => {
    if (props.logger) {
      props.logger.error('Error: %s; Info: %s', err, errorInfo);
    }
    return <div>!</div>;
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
