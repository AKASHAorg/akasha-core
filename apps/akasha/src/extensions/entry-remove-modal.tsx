import singleSpaReact from 'single-spa-react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
import { useErrors, useLoginState, usePosts } from '@akashaproject/ui-awf-hooks';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import { QueryClientProvider, QueryClient } from 'react-query';
import getSDK from '@akashaproject/awf-sdk';
import { events } from '@akashaproject/awf-sdk/typings';
import { filter } from 'rxjs/operators';

const { ThemeSelector, lightTheme, darkTheme, ConfirmationModal } = DS;

const queryClient = new QueryClient();

const EntryRemoveModal: React.FC<RootComponentProps> = props => {
  const { activeModal } = props;
  const sdk = React.useMemo(getSDK, []);
  const [errorState, errorActions] = useErrors({
    logger: props.logger,
  });
  const { t } = useTranslation();
  const [loginState] = useLoginState({
    onError: errorActions.createError,
  });
  const [, postsActions] = usePosts({
    user: loginState.ethAddress,
    onError: errorActions.createError,
  });

  const handleDeletePost = () => {
    if (activeModal.entryType === 'Comment') {
      return postsActions.removeComment(activeModal.entryId);
    }
    postsActions.removePost(activeModal.entryId);
  };

  React.useEffect(() => {
    if (!sdk) {
      return;
    }
    const sub = sdk.api.globalChannel
      .pipe(
        filter(
          payload =>
            payload.event === events.ENTRY_EVENTS.REMOVE ||
            payload.event === events.COMMENTS_EVENTS.REMOVE,
        ),
      )
      .subscribe({
        next: resp => {
          if (
            typeof resp.data === 'object' &&
            (resp.data.hasOwnProperty('removePost') || resp.data.hasOwnProperty('removeComment'))
          ) {
            const data = resp.data as { removePost?: boolean; removeComment: boolean };
            const args = resp.args as { entryID?: string; commentID?: string };
            if (
              (data.removePost || data.removeComment) &&
              (args.entryID === activeModal.entryId || args.commentID === activeModal.entryId)
            ) {
              if (!Object.keys(errorState).length) {
                handleModalClose();
              }
            } else if (!data.removeComment && !data.removePost) {
              errorActions.createError({
                errorKey: 'entry-remove-modal.globalChannel',
                error: new Error(t('Cannot delete this entry. Please try again later!')),
                critical: false,
              });
            }
          }
        },
        error: err =>
          errorActions.createError({
            errorKey: 'entry-remove-modal.globalChannel',
            error: err,
            critical: false,
          }),
      });
    return sub.unsubscribe;
  }, [sdk]);

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };
  const entryLabelText = React.useMemo(() => {
    if (activeModal.entryType === 'Post') {
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
    <QueryClientProvider client={queryClient}>
      <ThemeSelector
        availableThemes={[lightTheme, darkTheme]}
        settings={{ activeTheme: 'Light-Theme' }}
      >
        <React.Suspense fallback={'...'}>
          <I18nextProvider i18n={i18n}>
            <EntryRemoveModal {...props} />
          </I18nextProvider>
        </React.Suspense>
      </ThemeSelector>
    </QueryClientProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: ModalWrapper,
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
