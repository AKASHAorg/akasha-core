import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
import { uploadMediaToTextile } from '@akashaproject/ui-awf-hooks/lib/utils/media-utils';
import { PublishPostData } from '@akashaproject/ui-awf-hooks/lib/use-posts';
import { useMentions, useLoginState, useProfile, withProviders } from '@akashaproject/ui-awf-hooks';
import { useCreatePost, useEditPost, usePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { buildPublishObject } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';

const { EditorModal } = DS;

const EditorModalContainer = (props: RootComponentProps) => {
  const { logger } = props;

  const { t } = useTranslation();

  // const [, errorActions] = useErrors({ logger });

  const [loginState] = useLoginState({
    // onError: errorActions.createError,
  });

  const [loggedProfileData] = useProfile({
    // onError: errorActions.createError,
  });

  const [mentionsState, mentionsActions] = useMentions({
    // onError: errorActions.createError,
  });
  const isEditing = React.useMemo(
    () => props.activeModal.hasOwnProperty('entryId') && props.activeModal.action === 'edit',
    [props.activeModal],
  );

  const hasEmbed = React.useMemo(() => props.activeModal.hasOwnProperty('embedEntry'), [
    props.activeModal,
  ]);

  const embeddedPost = usePost(props.activeModal.embedEntry, hasEmbed);

  const editingPost = usePost(props.activeModal.entryId, isEditing);

  const editPost = useEditPost();

  const publishPost = useCreatePost();

  const handleEntryPublish = React.useCallback(
    async (data: PublishPostData) => {
      if (isEditing) {
        editPost.mutate({ entryID: props.activeModal.entryId, ...buildPublishObject(data) });
      } else {
        publishPost.mutate(buildPublishObject(data));
      }
      props.singleSpa.navigateToUrl(location.pathname);
    },
    [isEditing, props.activeModal, props.singleSpa, editPost, publishPost],
  );

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  if (isEditing && editingPost.isLoading) {
    return <>{t('Loading Editor')}</>;
  }
  return (
    <EditorModal
      titleLabel={isEditing ? t('Edit Post') : t('New Post')}
      avatar={loggedProfileData.avatar}
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
      embedEntryData={embeddedPost.data?.content}
      style={{ width: '36rem' }}
      editorState={editingPost.data?.content}
    />
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
