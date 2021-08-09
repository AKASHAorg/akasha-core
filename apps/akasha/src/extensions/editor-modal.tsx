import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { uploadMediaToTextile } from '@akashaproject/ui-awf-hooks/lib/utils/media-utils';
import { PublishPostData } from '@akashaproject/ui-awf-hooks/lib/use-posts';
import { useMentions, useLoginState, useErrors, withProviders } from '@akashaproject/ui-awf-hooks';
import { useGetProfile } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
import { useCreatePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { buildPublishObject } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';

const { EditorModal } = DS;

const EditorModalContainer = (props: RootComponentProps) => {
  const { logger } = props;

  const { t } = useTranslation();
  const location = useLocation();

  const [, errorActions] = useErrors({ logger });

  const [loginState] = useLoginState({
    onError: errorActions.createError,
  });

  const profileDataReq = useGetProfile(loginState.pubKey);
  const loggedProfileData = profileDataReq.data;

  const [mentionsState, mentionsActions] = useMentions({
    onError: errorActions.createError,
  });

  const publishPost = useCreatePost();
  const handleEntryPublish = async (data: PublishPostData) => {
    publishPost.mutate(buildPublishObject(data));
    handleModalClose();
  };

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  return (
    <EditorModal
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
      embedEntryData={props.activeModal.embedEntry}
      style={{ width: '36rem' }}
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
    <Router>
      <React.Suspense fallback={<></>}>
        <I18nextProvider i18n={i18n}>
          <EditorModalContainer {...props} />
        </I18nextProvider>
      </React.Suspense>
    </Router>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Wrapped),
  errorBoundary: (err, errorInfo, props) => {
    if (props.logger) {
      props.logger('Error: %s; Info: %s', err, errorInfo);
    }
    return <div>!</div>;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
