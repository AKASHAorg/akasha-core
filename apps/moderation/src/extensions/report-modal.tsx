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
import { BrowserRouter as Router } from 'react-router-dom';
import { ModerationItemTypes, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useErrors, withProviders, useReasons, useModeration } from '@akashaproject/ui-awf-hooks';
import { BASE_REPORT_URL } from '../services/constants';
import { useGetLogin } from '@akashaproject/ui-awf-hooks/lib/use-login.new';

const { ReportModal } = DS;

const ReportModalComponent = (props: RootComponentProps) => {
  const { logger, activeModal } = props;

  const [, errorActions] = useErrors({ logger });

  const loginQuery = useGetLogin({
    onError: errorActions.createError,
  });

  const [reasons, reasonsActions] = useReasons({ onError: errorActions.createError });

  const { t } = useTranslation();

  React.useEffect(() => {
    reasonsActions.fetchReasons({ active: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  const itemType = React.useMemo(() => {
    if (activeModal.hasOwnProperty('itemType') && typeof activeModal.itemType === 'string') {
      return activeModal.itemType;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reportMutation = useModeration();

  const onReport = React.useCallback(
    (dataToSign: Record<string, string>) =>
      reportMutation.mutate({
        dataToSign,
        contentId: activeModal.entryId,
        contentType: itemType,
        url: `${BASE_REPORT_URL}/new`,
        modalName: 'report-modal',
      }),

    [itemType, activeModal.entryId, reportMutation],
  );

  return (
    <ReportModal
      titleLabel={t(
        `Report ${itemType === ModerationItemTypes.ACCOUNT ? activeModal.user : itemType}`,
      )}
      successTitleLabel={t('Thank you for helping us keep Ethereum World safe! 🙌')}
      successMessageLabel={t(`We will investigate this ${itemType} and take appropriate action.`)}
      optionsTitleLabel={t('Please select a reason')}
      optionLabels={reasons.map((el: string) => t(el))}
      optionValues={reasons}
      descriptionLabel={t('Explanation')}
      descriptionPlaceholder={t('Please explain your reason(s)')}
      footerText1Label={t('If you are unsure, you can refer to our')}
      footerLink1Label={t('Code of Conduct')}
      footerUrl1={'/legal/code-of-conduct'}
      footerText2Label={t('and')}
      footerLink2Label={t('Terms of Service')}
      footerUrl2={'/legal/terms-of-service'}
      cancelLabel={t('Cancel')}
      reportLabel={t('Report')}
      blockLabel={t('Block User')}
      closeLabel={t('Close')}
      errorText={reportMutation.error ? `${reportMutation.error}` : ''}
      user={loginQuery.data?.pubKey || ''}
      contentId={activeModal.entryId}
      itemType={itemType}
      requesting={reportMutation.status === 'loading'}
      success={reportMutation.status === 'success'}
      closeModal={handleModalClose}
      onReport={onReport}
    />
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
  errorBoundary: (err, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(err)}, ${errorInfo}`);
    }
    return <div>!</div>;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
