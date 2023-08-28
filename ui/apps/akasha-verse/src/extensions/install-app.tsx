import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';

import getSDK from '@akashaorg/awf-sdk';
import InstallApp from '@akashaorg/design-system-components/lib/components/InstallApp';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { EventTypes, UIEventData, RootExtensionProps } from '@akashaorg/typings/ui';
import { APP_EVENTS } from '@akashaorg/typings/sdk';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { withProviders } from '@akashaorg/ui-awf-hooks';

const IntegrationInstallModal: React.FC<RootExtensionProps> = props => {
  const { extensionData, uiEvents, singleSpa } = props;
  const sdk = getSDK();
  const { t } = useTranslation('app-akasha-integration');

  const PROGRESS_STEP_TO_PROGRESS_INFO_MAP = {
    1: t('Saving install information...'),
    2: t('Downloading App resources...'),
    3: t('Installing App intro your World...'),
  };

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
    const sub = uiEvents.subscribe({
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

  const installApp = null;

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
    if (singleSpa) {
      singleSpa.navigateToUrl(location.pathname);
    }
  }, [singleSpa]);

  return (
    /*@TODO: revisit props when new install/uninstall hooks are ready to be integrated*/
    <InstallApp
      title={t('Installation in progress')}
      appName={integrationName} /*@TODO: revisit*/
      progressInfo={PROGRESS_STEP_TO_PROGRESS_INFO_MAP[modalState]} /*@TODO: revisit*/
      status="in-progress" /*@TODO: revisit*/
      action={{ label: 'Cancel installation', onClick: () => ({}) }} /*@TODO: revisit*/
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
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(ModalWrapper),
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`Error in InstallModal: ${JSON.stringify(err)}, ${errorInfo}`);
    }
    return <ErrorLoader type="script-error" title="Error in install modal" details={err.message} />;
  },
});

export const bootstrap = reactLifecycles.bootstrap;
export const mount = reactLifecycles.mount;
export const unmount = reactLifecycles.unmount;
