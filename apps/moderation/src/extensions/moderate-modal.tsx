import * as React from 'react';
import i18next from 'i18next';
import ReactDOM from 'react-dom';
import Fetch from 'i18next-fetch-backend';
import getSDK from '@akashaproject/awf-sdk';
import singleSpaReact from 'single-spa-react';
import DS from '@akashaproject/design-system';
import Backend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useLoginState, useErrors } from '@akashaproject/ui-awf-hooks';

import { BASE_DECISION_URL } from '../services/constants';

const { ModerateModal, ToastProvider, ThemeSelector, lightTheme, darkTheme } = DS;

const ModerateModalComponent = (props: RootComponentProps) => {
  const { logger, activeModal } = props;

  const [requesting, setRequesting] = React.useState<boolean>(false);

  const [, errorActions] = useErrors({ logger });

  const [loginState] = useLoginState({
    onError: errorActions.createError,
  });

  const { t } = useTranslation();
  const location = useLocation();

  const sdk = getSDK();

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  const postData = async (url = '', data = {}) => {
    const postURL = `${url}/moderate`;
    const rheaders = new Headers();
    rheaders.append('Content-Type', 'application/json');

    const response = await fetch(postURL, {
      method: 'POST',
      headers: rheaders,
      body: JSON.stringify(data),
    });
    return response.status;
  };

  const onModerate = (dataToSign: Record<string, unknown>) => {
    setRequesting(true);
    sdk.api.auth.signData(dataToSign).subscribe(async (resp: any) => {
      const data = {
        data: dataToSign,
        contentId: activeModal.entryId,
        contentType: activeModal.contentType,
        signature: btoa(String.fromCharCode.apply(null, resp.data.signature)),
      };

      postData(BASE_DECISION_URL, data)
        .then(status => {
          if (status === 400) {
            throw new Error('Bad request. Please try again later');
          } else if (status === 403) {
            throw new Error('You are not authorized to perform this operation');
          } else if (status === 409) {
            throw new Error('This content has already been moderated by you');
          } else if (status === 500) {
            throw new Error('Unable to process your request right now. Please try again later');
          }
          return handleModalClose();
        })
        .catch(error => {
          props.logger.error('[moderate-modal.tsx]: postData err %j', error.message || '');
        })
        .finally(() => setRequesting(false));
    });
  };

  return (
    <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
      <ModerateModal
        titleLabel={t('Make a Decision')}
        altTitleLabel={t('Review a Decision')}
        decisionLabel={t('Decision')}
        optionLabels={[t('Delist'), t('Keep')]}
        optionValues={['Delist', 'Keep']}
        descriptionLabel={t('Evaluation')}
        descriptionPlaceholder={t('Please explain the reason(s)')}
        footerText1Label={t('If you are unsure, you can refer to our')}
        footerLink1Label={t('Code of Conduct')}
        footerUrl1={'/legal/code-of-conduct'}
        cancelLabel={t('Cancel')}
        user={loginState.ethAddress ? loginState.ethAddress : ''}
        requesting={requesting}
        isReview={activeModal.status !== 'pending'}
        closeModal={handleModalClose}
        onModerate={onModerate}
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
    <ThemeSelector
      availableThemes={[lightTheme, darkTheme]}
      settings={{ activeTheme: 'Light-Theme' }}
    >
      <Router>
        <React.Suspense fallback={<></>}>
          <I18nextProvider i18n={i18next}>
            <ModerateModalComponent {...props} />
          </I18nextProvider>
        </React.Suspense>
      </Router>
    </ThemeSelector>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Wrapped,
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
