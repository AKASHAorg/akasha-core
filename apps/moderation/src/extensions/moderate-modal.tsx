import * as React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import DS from '@akashaproject/design-system';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router } from 'react-router-dom';
import { useErrors, useModeration, withProviders } from '@akashaproject/ui-awf-hooks';
import { BASE_DECISION_URL } from '../services/constants';
import i18n, { setupI18next } from '../i18n';
import { useGetLogin } from '@akashaproject/ui-awf-hooks/lib/use-login.new';

const { ModerateModal } = DS;

const ModerateModalComponent = (props: RootComponentProps) => {
  const { logger, activeModal } = props;

  const [, errorActions] = useErrors({ logger });

  const loginQuery = useGetLogin({ onError: errorActions.createError });

  const { t } = useTranslation();

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  const itemType = React.useMemo(() => {
    if (activeModal.hasOwnProperty('itemType') && typeof activeModal.itemType === 'string') {
      return activeModal.itemType;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moderateMutation = useModeration();

  const onModerate = React.useCallback(
    (dataToSign: Record<string, string>) => {
      moderateMutation.mutate({
        dataToSign,
        contentId: activeModal.entryId,
        contentType: itemType,
        url: `${BASE_DECISION_URL}/moderate`,
        modalName: 'moderate-modal',
      });
    },
    [itemType, activeModal.entryId, moderateMutation],
  );

  React.useEffect(() => {
    if (moderateMutation.status === 'success') {
      handleModalClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moderateMutation]);

  return (
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
      errorText={moderateMutation.error ? `${moderateMutation.error}` : ''}
      user={loginQuery.data?.pubKey || ''}
      requesting={moderateMutation.status === 'loading'}
      isReview={activeModal.status !== 'pending'}
      closeModal={handleModalClose}
      onModerate={onModerate}
    />
  );
};

const Wrapped = (props: RootComponentProps) => {
  return (
    <Router>
      <I18nextProvider i18n={i18n}>
        <ModerateModalComponent {...props} />
      </I18nextProvider>
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

export const bootstrap = (props: RootComponentProps) => {
  return setupI18next({
    logger: props.logger,
    // must be the same as the one in ../../i18next.parser.config.js
    namespace: 'app-moderation-ewa',
  });
};

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
