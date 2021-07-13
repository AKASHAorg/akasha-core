import singleSpaReact from 'single-spa-react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
import { useErrors, useLoginState, usePosts } from '@akashaproject/ui-awf-hooks';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';

const { ThemeSelector, lightTheme, darkTheme, ConfirmationModal } = DS;

const EntryRemoveModal: React.FC<RootComponentProps> = props => {
  const { activeModal } = props;
  const [errorState, errorActions] = useErrors({
    logger: props.logger,
  });

  const [loginState] = useLoginState({
    onError: errorActions.createError,
  });
  const [, postsActions] = usePosts({
    user: loginState.ethAddress,
    onError: errorActions.createError,
  });

  const handleDeletePost = () => {
    postsActions.removePost(activeModal.entryId);
  };

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  return (
    <>
      <ConfirmationModal
        onClose={handleModalClose}
        onConfirm={handleDeletePost}
        onCancel={handleModalClose}
        modalTitle={'Delete post'}
        closeLabel={'Close'}
        textDetails={
          <>
            <div>Are you sure you want to delete your post?</div>
            <div>This cannot be undone.</div>
          </>
        }
        cancelLabel="Cancel"
        confirmLabel="Delete"
        errors={errorState}
      />
    </>
  );
};

const ModalWrapper: React.FC<RootComponentProps> = props => {
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
    <ThemeSelector
      availableThemes={[lightTheme, darkTheme]}
      settings={{ activeTheme: 'Light-Theme' }}
    >
      <I18nextProvider i18n={i18n}>
        <EntryRemoveModal {...props} />
      </I18nextProvider>
    </ThemeSelector>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: ModalWrapper,
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
