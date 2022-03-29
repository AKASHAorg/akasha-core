import singleSpaReact from 'single-spa-react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootExtensionProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
import { EventTypes, UIEventData } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { I18nextProvider, useTranslation } from 'react-i18next';
import {
  useInstallApp,
  withProviders,
  //   useAnalytics,
  ThemeWrapper,
} from '@akashaproject/ui-awf-hooks';
import getSDK from '@akashaproject/awf-sdk';
import { APP_EVENTS } from '@akashaproject/sdk-typings/lib/interfaces/events';

const { InstallModal, ModalContainer, ErrorLoader } = DS;

const IntegrationInstallModal: React.FC<RootExtensionProps> = props => {
  const { activeModal } = props;
  const sdk = getSDK();
  const { t } = useTranslation('app-akasha-integration');

  const integrationName: string = React.useMemo(() => {
    if (activeModal && activeModal.integrationName) {
      return activeModal.integrationName as string;
    }
    return '';
  }, [activeModal]);

  const [modalState, setModalState] = React.useState(1);

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
    installApp.mutate({ name: integrationName });
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
      error={null}
      cancelLabel={t('Cancel')}
      continueLabel={t('Continue')}
      cancelTitleLabel={t('Cancel installation')}
      cancelSubtitleLabel={t('Are you sure you want to cancel the installation?')}
      doneLabel={t('Done')}
      dismissLabel={t('Dismiss')}
      modalTitleLabel={t('App Install')}
      integrationName={integrationName}
      installTitleLabel1={t('To add')}
      installTitleLabel2={t(
        'to your World we have to do a few things first. This will take less than a minute.',
      )}
      installStep={modalState}
      savingInfoLabel={t('Saving install information')}
      downloadingResourcesLabel={t('Downloading resources')}
      successTitleLabel={t('Done!')}
      successInfoLabel={t(
        'To check out your new app visit the Integration centre and look under Your Apps. You can also open the side bar menu.',
      )}
      successSubInfoLabel={t('Enjoy!')}
      successSubtitleLabel={t(
        'Moderating Tools App is now installed in Ethereum World and is currently active.',
      )}
      errorInfoLabel={t('Please check your network connection and try again.')}
      errorSubInfoLabel={t('Thank you!')}
      errorSubtitleLabel={t('could not be installed in Ethereum World.')}
      errorTitleLabel={t('Oops!')}
    />
  );
};

const ModalWrapper: React.FC<RootExtensionProps> = props => {
  return (
    <I18nextProvider i18n={props.plugins?.translation?.i18n}>
      <IntegrationInstallModal {...props} />
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(ModalWrapper),
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
