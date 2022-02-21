import * as React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import DS from '@akashaproject/design-system';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { ModerationItemTypes, RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  withProviders,
  useReasons,
  useGetLogin,
  useReport,
  useAnalytics,
} from '@akashaproject/ui-awf-hooks';
import { BASE_REPORT_URL, I18N_NAMESPACE } from '../services/constants';

const { ReportModal } = DS;

const ReportModalComponent = (props: RootComponentProps) => {
  const { activeModal } = props;
  const [analyticsActions] = useAnalytics();

  const loginQuery = useGetLogin();

  const [reasons, reasonsActions] = useReasons();

  const { t } = useTranslation(I18N_NAMESPACE);

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

  const reportMutation = useReport();

  const onReport = React.useCallback(
    (dataToSign: Record<string, string>) => {
      analyticsActions.trackEvent({
        category: itemType,
        action: 'Report',
      });
      reportMutation.mutate({
        dataToSign,
        contentId: activeModal.entryId,
        contentType: itemType,
        url: `${BASE_REPORT_URL}/new`,
      });
    },

    [itemType, activeModal.entryId, reportMutation, analyticsActions],
  );

  return (
    <ReportModal
      titleLabel={t('Report {{itemType}}', {
        itemType: itemType === ModerationItemTypes.ACCOUNT ? activeModal.user : itemType,
      })}
      successTitleLabel={t('Thank you for helping us keep Ethereum World safe! 🙌')}
      successMessageLabel={t('We will investigate this {{itemType}} and take appropriate action.', {
        itemType,
      })}
      optionsTitleLabel={t('Please select a reason')}
      optionLabels={reasons.map((el: string) =>
        t('{{ reportModalReason }}', { reportModalReason: el }),
      )}
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

const Wrapped = (props: RootComponentProps) => (
  <Router>
    <React.Suspense fallback={<></>}>
      <I18nextProvider i18n={props.plugins?.translation?.i18n}>
        <ReportModalComponent {...props} />
      </I18nextProvider>
    </React.Suspense>
  </Router>
);

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
