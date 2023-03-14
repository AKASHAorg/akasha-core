import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';

import getSDK from '@akashaorg/awf-sdk';
import DS from '@akashaorg/design-system';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { EventTypes, UIEventData, RootExtensionProps } from '@akashaorg/typings/ui';
import { APP_EVENTS } from '@akashaorg/typings/sdk';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useInstallApp, withProviders, ThemeWrapper } from '@akashaorg/ui-awf-hooks';

const { InstallModal, ModalContainer } = DS;

const IntegrationInstallModal: React.FC<RootExtensionProps> = props => {
  const { extensionData } = props;
  const sdk = getSDK();
  const { t } = useTranslation('app-akasha-integration');

  const integrationName: string = React.useMemo(() => {
    if (extensionData && extensionData.integrationName) {
      return extensionData.integrationName as string;
    }
    return '';
  }, [extensionData]);

  const [modalState, setModalState] = React.useState(1);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const subSDK = sdk.api.globalChannel.subscribe({
      next: (eventData: { data: { name: string }; event: APP_EVENTS }) => {
        if (eventData.event === APP_EVENTS.INFO_READY && eventData.data.name === integrationName) {
          setModalState(2);
        }
      },
    });
    const sub = props.uiEvents.subscribe({
      next: (eventData: UIEventData) => {
        if (
          eventData.event === EventTypes.RegisterIntegration &&
          eventData.data.name === integrationName
        ) {
          setModalState(3);
        }
      },
    });
    return () => {
      subSDK.unsubscribe();
      sub.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   const [analyticsActions] = useAnalytics();

  const installApp = useInstallApp();

  React.useEffect(() => {
    installApp.mutate(
      { name: integrationName },
      {
        onError: error => {
          setModalState(3);
          setError(error as Error);
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModalClose = React.useCallback(() => {
    if (props.singleSpa) {
      props.singleSpa.navigateToUrl(location.pathname);
    }
  }, [props.singleSpa]);

  return (
    <InstallModal
      onCancel={() => {
        return null;
      }}
      onCloseModal={handleModalClose}
      error={error}
      cancelLabel={t('Cancel')}
      continueLabel={t('Continue')}
      cancelTitleLabel={t('Cancel installation')}
      cancelSubtitleLabel={t('Are you sure you want to cancel the installation?')}
      doneLabel={t('Done')}
      dismissLabel={t('Dismiss')}
      modalTitleLabel={t('App Install')}
      integrationName={integrationName}
      installTitleLabel={t(
        'To add {{integrationName}} to your World we have to do a few things first. This will take less than a minute.',
        { integrationName },
      )}
      installStep={modalState}
      savingInfoLabel={t('Saving install information')}
      downloadingResourcesLabel={t('Downloading resources')}
      successTitleLabel={t('Done!')}
      successInfoLabel={t(
        'To check out your new app visit the {{integrationCentreName}} and look under Your Apps. You can also open the side bar menu.',
        { integrationCentreName: 'Integration Centre' },
      )}
      successSubInfoLabel={t('Enjoy!')}
      successSubtitleLabel={t(
        '{{integrationName}} is now installed in {{worldName}} and is currently active.',
        { integrationName, worldName: props.worldConfig.title },
      )}
      errorInfoLabel={t('Please check your network connection and try again.')}
      errorSubInfoLabel={t('Thank you!')}
      errorSubtitleLabel={t('{{integrationName}} could not be installed in {{worldName}}.', {
        integrationName,
        worldName: props.worldConfig.title,
      })}
      errorTitleLabel={t('Oops!')}
    />
  );
};

const ModalWrapper: React.FC<RootExtensionProps> = props => {
  return (
    <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
      <IntegrationInstallModal {...props} />
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(ModalWrapper),
  renderType: 'createRoot',
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`Error in InstallModal: ${JSON.stringify(err)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <ModalContainer>
          <ErrorLoader type="script-error" title="Error in install modal" details={err.message} />
        </ModalContainer>
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;
export const mount = reactLifecycles.mount;
export const unmount = reactLifecycles.unmount;
