import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import {
  RootExtensionProps,
  AnalyticsCategories,
  EntityTypes,
  ModerationEntityTypesMap,
} from '@akashaorg/typings/ui';
import {
  withProviders,
  useReasons,
  useGetLogin,
  useReport,
  useAnalytics,
  ThemeWrapper,
} from '@akashaorg/ui-awf-hooks';

import getReasonPrefix from '../utils/getReasonPrefix';
import { BASE_REPORT_URL } from '../services/constants';

const { ReportModal } = DS;

const ReportModalComponent = (props: RootExtensionProps) => {
  const { extensionData } = props;

  const [reason, setReason] = React.useState<string>('');
  const [explanation, setExplanation] = React.useState('');

  const [analyticsActions] = useAnalytics();
  const loginQuery = useGetLogin();
  const [reasons, reasonsActions] = useReasons();
  const { t } = useTranslation('app-moderation-ewa');

  React.useEffect(() => {
    reasonsActions.fetchReasons({ active: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemType = React.useMemo(() => {
    if (props.extensionData.hasOwnProperty('itemType')) {
      return props.extensionData.itemType;
    }
  }, [props.extensionData]);
  const itemTypeName = ModerationEntityTypesMap[itemType];

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  const handleSelectReason = (reason: string) => setReason(reason);

  const handleSetExplanation = (explanation: string) => setExplanation(explanation);

  const reportMutation = useReport();

  const onReport = React.useCallback(
    (dataToSign: Record<string, string>) => {
      analyticsActions.trackEvent({
        category: AnalyticsCategories.POST,
        action: `${itemTypeName.toLocaleUpperCase()}${itemTypeName.substring(1)} Reported`,
      });
      reportMutation.mutate({
        dataToSign,
        contentId: extensionData.itemId,
        contentType: itemTypeName,
        url: `${BASE_REPORT_URL}/new`,
      });
    },

    [analyticsActions, itemTypeName, reportMutation, extensionData.itemId],
  );

  return (
    <ReportModal
      titleLabel={t('Report {{ itemTypeName }}', {
        itemTypeName: itemType === EntityTypes.PROFILE ? extensionData.user : itemTypeName,
      })}
      successTitleLabel={t('Thank you for helping us keep Ethereum World safe! 🙌')}
      successMessageLabel={t(
        'We will investigate this {{itemTypeName}} and take appropriate action.',
        {
          itemTypeName,
        },
      )}
      reasonPrefix={getReasonPrefix(reason)}
      contentId={reportMutation.data?.decisionID as string}
      footerLabel="Feel like you want to contribute more to improve our community?"
      footerCTAUrl="https://discord.gg/A5wfg6ZCRt"
      footerCTALabel="Join our Moderation Discord channel"
      optionsTitleLabel={t('Please select a reason')}
      optionLabels={reasons.map((el: string) =>
        t('{{ reportModalReason }}', { reportModalReason: el }),
      )}
      optionValues={reasons}
      reason={reason}
      descriptionLabel={t('Explanation')}
      descriptionPlaceholder={t('Please explain your reason(s)')}
      explanation={explanation}
      footerText1Label={t('If you are unsure, you can refer to our')}
      footerLink1Label={t('Code of Conduct')}
      footerUrl1={`${window.location.protocol}//${window.location.host}/@akashaorg/app-legal/code-of-conduct`}
      footerText2Label={t('and')}
      footerLink2Label={t('Terms of Service')}
      footerUrl2={`${window.location.protocol}//${window.location.host}/@akashaorg/app-legal/terms-of-service`}
      cancelLabel={t('Cancel')}
      reportLabel={t('Report')}
      errorText={reportMutation.error ? `${reportMutation.error}` : ''}
      user={loginQuery.data?.pubKey || ''}
      itemTypeName={itemTypeName}
      requesting={reportMutation.status === 'loading'}
      success={reportMutation.status === 'success'}
      onSelectReason={handleSelectReason}
      onSetExplanation={handleSetExplanation}
      closeModal={handleModalClose}
      onReport={onReport}
    />
  );
};

const Wrapped = (props: RootExtensionProps) => (
  <Router>
    <React.Suspense fallback={<></>}>
      <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
        <ReportModalComponent {...props} />
      </I18nextProvider>
    </React.Suspense>
  </Router>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Wrapped),
  renderType: 'createRoot',
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(err)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <ErrorLoader type="script-error" title="Error in report modal" details={err.message} />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
