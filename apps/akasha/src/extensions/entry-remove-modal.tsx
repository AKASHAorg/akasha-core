import singleSpaReact from 'single-spa-react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
import { useErrors, withProviders } from '@akashaproject/ui-awf-hooks';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import { useDeletePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { useDeleteComment } from '@akashaproject/ui-awf-hooks/lib/use-comments.new';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';

const { ConfirmationModal } = DS;

const EntryRemoveModal: React.FC<RootComponentProps> = props => {
  const { activeModal } = props;
  const [errorState] = useErrors({
    logger: props.logger,
  });
  const { t } = useTranslation();

  const postDeleteQuery = useDeletePost(activeModal.entryId);
  const commentDeleteQuery = useDeleteComment(activeModal.entryId);

  const handleDeletePost = () => {
    if (activeModal.entryType === ItemTypes.COMMENT) {
      return commentDeleteQuery.mutate(activeModal.entryId);
    }
    postDeleteQuery.mutate(activeModal.entryId);
    handleModalClose();
  };

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };
  const entryLabelText = React.useMemo(() => {
    if (activeModal.entryType === ItemTypes.ENTRY) {
      return t('post');
    }
    return t('reply');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModal.entryType]);

  return (
    <ConfirmationModal
      onClose={handleModalClose}
      onConfirm={handleDeletePost}
      onCancel={handleModalClose}
      modalTitle={`${t('Delete')} ${entryLabelText}`}
      closeLabel={t('Close')}
      textDetails={
        <>
          <div>
            {t('Are you sure you want to delete your')} {entryLabelText}?
          </div>
          <div>{t('This cannot be undone')}.</div>
        </>
      }
      cancelLabel={t('Cancel')}
      confirmLabel={t('Delete')}
      errors={errorState}
    />
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
    <React.Suspense fallback={'...'}>
      <I18nextProvider i18n={i18n}>
        <EntryRemoveModal {...props} />
      </I18nextProvider>
    </React.Suspense>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(ModalWrapper),
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
