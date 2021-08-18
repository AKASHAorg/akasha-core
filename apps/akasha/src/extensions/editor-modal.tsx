import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
import { uploadMediaToTextile } from '@akashaproject/ui-awf-hooks/lib/utils/media-utils';
import { PublishPostData } from '@akashaproject/ui-awf-hooks/lib/use-posts';
import { useMentions, useLoginState, withProviders } from '@akashaproject/ui-awf-hooks';
import { useCreatePost, useEditPost, usePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { buildPublishObject, mapEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import { useGetProfile } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';

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
  i18n
    .use(initReactI18next)
    .use(Backend)
    .use(LanguageDetector)
    .use({
      type: 'logger',
      log: props.logger.info,
      warn: props.logger.warn,
      error: props.logger.error,
    })
    .init({
      fallbackLng: 'en',
      ns: ['akasha-app'],
      saveMissing: false,
      saveMissingTo: 'all',
      load: 'languageOnly',
      debug: true,
      cleanCode: true,
      keySeparator: false,
      defaultNS: 'akasha-app',
      backend: {
        backends: [LocalStorageBackend, Fetch],
        backendOptions: [
          {
            prefix: 'i18next_res_v0',
            expirationTime: 24 * 60 * 60 * 1000,
          },
          {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
          },
        ],
      },
    });
  return (
    <React.Suspense fallback={<>...</>}>
      <I18nextProvider i18n={i18n}>
        <EditorModalContainer {...props} />
      </I18nextProvider>
    </React.Suspense>
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

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
