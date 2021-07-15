import * as React from 'react';
import i18next from 'i18next';
import ReactDOM from 'react-dom';
import Fetch from 'i18next-fetch-backend';
import singleSpaReact from 'single-spa-react';
import DS from '@akashaproject/design-system';
import Backend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import {
  useLoginState,
  useErrors,
  usePosts,
  moderationRequest,
  withProviders,
  useReasons,
} from '@akashaproject/ui-awf-hooks';
import { BASE_REPORT_URL } from '../services/constants';

const { ReportModal, ToastProvider } = DS;

const ReportModalComponent = (props: RootComponentProps) => {
  const { logger, activeModal } = props;

  const [requesting, setRequesting] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);

  const [, errorActions] = useErrors({ logger });

  const [loginState] = useLoginState({
    onError: errorActions.createError,
  });

  const [postsState, postsActions] = usePosts({
    user: loginState.ethAddress,
    onError: errorActions.createError,
  });

  const [reasons, reasonsActions] = useReasons({ onError: errorActions.createError });

  const { t } = useTranslation();
  const location = useLocation();

  React.useEffect(() => {
    reasonsActions.fetchReasons({ active: true });
  }, []);

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  const updateEntry = (entryId: string) => {
    const modifiedEntry = { ...postsState.postsData[entryId], reported: true };
    postsActions.updatePostsState(modifiedEntry);
  };

  const onReport = (dataToSign: Record<string, unknown>) => {
    moderationRequest.modalClickHandler({
      dataToSign,
      setRequesting,
      contentId: activeModal.entryId,
      contentType: activeModal.contentType,
      url: `${BASE_REPORT_URL}/new`,
      modalName: 'report-modal',
      logger: props.logger,
      callback: setSuccess,
    });
  };

  return (
    <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
      <ReportModal
        titleLabel={t(`Report ${activeModal.contentType}`)}
        successTitleLabel={t('Thank you for helping us keep Ethereum World safe! 🙌')}
        successMessageLabel={t('We will investigate this post and take appropriate action.')}
        optionsTitleLabel={t('Please select a reason')}
        optionLabels={reasons.map((el: string) => t(el))}
        optionValues={reasons}
        descriptionLabel={t('Explanation')}
        descriptionPlaceholder={t('Please explain your reason(s)')}
        footerText1Label={t('If you are unsure, you can refer to our')}
        footerLink1Label={t('Code of Conduct')}
        footerUrl1={'/legal/code-of-conduct'}
        cancelLabel={t('Cancel')}
        reportLabel={t('Report')}
        blockLabel={t('Block User')}
        closeLabel={t('Close')}
        user={loginState.ethAddress ? loginState.ethAddress : ''}
        contentId={activeModal.entryId}
        contentType={activeModal.contentType}
        requesting={requesting}
        success={success}
        updateEntry={updateEntry}
        closeModal={handleModalClose}
        onReport={onReport}
      />
    </ToastProvider>
  );
};

const Wrapped = (props: RootComponentProps) => {
  const { logger } = props;

  i18next
    .use(initReactI18next)
    .use(Backend)
    .use(LanguageDetector)
    .use({
      type: 'logger',
      log: logger.info,
      warn: logger.warn,
      error: logger.error,
    })
    .init({
      fallbackLng: 'en',
      ns: ['moderation-app'],
      saveMissing: false,
      saveMissingTo: 'all',
      load: 'languageOnly',
      debug: true,
      cleanCode: true,
      keySeparator: false,
      defaultNS: 'moderation-app',
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
        <I18nextProvider i18n={i18next}>
          <ReportModalComponent {...props} />
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
      props.logger.error('Error: %s; Info: %s', err, errorInfo);
    }
    return <div>!</div>;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
