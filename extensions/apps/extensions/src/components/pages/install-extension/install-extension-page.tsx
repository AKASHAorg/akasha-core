import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import InstallApp, {
  InstallAppProps,
} from '@akashaorg/design-system-components/lib/components/InstallApp';
import { useTranslation } from 'react-i18next';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { useGetAppsByPublisherDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated';
import getSDK from '@akashaorg/core-sdk';
import { SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { GetAppsByPublisherDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { getReportedError, getReportedProgress } from './utils';

export const InstallExtensionPage = ({ appId }: { appId: string }) => {
  const { t } = useTranslation('app-extensions');
  const { decodeAppName, getCorePlugins } = useRootComponentProps();
  const decodeName = React.useRef(decodeAppName);
  const installer = useRef(getCorePlugins().extensionInstaller);
  const installerStatusCodes = React.useRef(installer.current.getStaticStatusCodes());
  const isInstalling = React.useRef(false);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [reportedStatus, setReportedStatus] = useState<symbol>();
  const [reportedError, setReportedError] = useState<{ code: symbol; retryable: boolean }>(null);
  const [shouldRegisterResources, setShouldRegisterResources] = useState<boolean>(false);
  const idxDid = getSDK().services.gql.indexingDID;

  const {
    data: { authenticatedDID, isAuthenticating },
  } = useAkashaStore();

  const { data, loading, called, error } = useGetAppsByPublisherDidQuery({
    variables: {
      id: idxDid,
      first: 1,
      filters: { where: { name: { equalTo: decodeName.current(appId) } } },
      sorting: { createdAt: SortOrder.Desc },
    },
  });

  const retryableError: symbol[] = useMemo(
    () => [
      installerStatusCodes.current.error.EXTENSION_FETCH_ERROR,
      installerStatusCodes.current.error.EXTENSION_IMPORT_ERROR,
      installerStatusCodes.current.error.EXTENSION_INITIALIZATION_FAILED,
      installerStatusCodes.current.error.EXTENSION_REGISTER_RESOURCES_FAILED,
      installerStatusCodes.current.error.EXTENSION_INFO_SAVE_FAILED,
      installerStatusCodes.current.error.EXTENSION_FINALIZATION_FAILED,
    ],
    [],
  );

  const handleLoginClick = useCallback(() => {
    getCorePlugins().routing.navigateTo({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (appRoutes: Record<string, string>) => {
        return `${appRoutes.Connect}?${new URLSearchParams({
          redirectTo: location.pathname,
        })}`;
      },
    });
  }, [getCorePlugins]);

  const triggerResourceRegistration = useCallback(() => {
    // handle signature;
  }, []);

  useEffect(() => {
    if (shouldRegisterResources /* && signedSuccessfully */) {
      // then continue the install process
      installer.current.postInstallExtension();
    }
  }, [shouldRegisterResources]);

  useEffect(() => {
    const appName = decodeName.current(appId);
    if (!isInstalling.current) {
      isInstalling.current = true;
      installer.current.installExtension(appName);
    }
  }, [appId]);

  useEffect(() => {
    return installer.current.subscribe(
      ({ currentStatus, errorStatus }: { currentStatus: symbol; errorStatus: symbol }) => {
        // the following steps will continue automatically
        // if there are no errors and if there are no resources to register
        switch (errorStatus) {
          case installerStatusCodes.current.error.USER_NOT_CONNECTED:
          case installerStatusCodes.current.error.EXTENSION_NOT_FOUND:
          case installerStatusCodes.current.error.EXTENSION_FETCH_ERROR:
          case installerStatusCodes.current.error.EXTENSION_DATA_INVALID:
          case installerStatusCodes.current.error.EXTENSION_IMPORT_ERROR:
          case installerStatusCodes.current.error.EXTENSION_INITIALIZATION_FAILED:
          case installerStatusCodes.current.error.EXTENSION_REGISTER_RESOURCES_FAILED:
          case installerStatusCodes.current.error.EXTENSION_REGISTRATION_FAILED:
          case installerStatusCodes.current.error.EXTENSION_INFO_SAVE_FAILED:
          case installerStatusCodes.current.error.EXTENSION_FINALIZATION_FAILED:
            if (retryableError.some(err => err === errorStatus)) {
              setReportedError({
                code: errorStatus,
                retryable: true,
              });
              break;
            }
            setReportedError({
              code: errorStatus,
              retryable: false,
            });
            break;
        }
        switch (currentStatus) {
          case installerStatusCodes.current.status.FETCHING_EXTENSION_DATA:
          case installerStatusCodes.current.status.IMPORTING_MODULE:
          case installerStatusCodes.current.status.INITIALIZING_EXTENSION:
          case installerStatusCodes.current.status.REGISTERING_EXTENSION:
          case installerStatusCodes.current.status.SAVING_EXTENSION_INFO:
          case installerStatusCodes.current.status.FINALIZING_INSTALL:
            setReportedStatus(currentStatus);
            break;
          // break the switch if there are resources to register.
          // it is required to call `postInstallExtension` after signature
          case installerStatusCodes.current.status.REGISTERING_RESOURCES:
            setReportedStatus(currentStatus);
            setShouldRegisterResources(true);
            break;
          case installerStatusCodes.current.status.REGISTERING_RESOURCES_SUCCESS:
            setReportedStatus(currentStatus);
            triggerResourceRegistration();
            break;
          case installerStatusCodes.current.status.INSTALL_SUCCESS:
            setReportedStatus(currentStatus);
            setIsInstalled(true);
            break;
        }
      },
    );
  }, [retryableError, triggerResourceRegistration]);

  const installStatus = useMemo((): InstallAppProps['status'] => {
    if (isInstalled) {
      return 'complete';
    }
    if (reportedError?.code) {
      return 'error';
    }
    return 'in-progress';
  }, [isInstalled, reportedError]);

  const progressInfo = useMemo(() => {
    if (isInstalled) {
      return `${t('Application {{displayName}} successfully installed.', {
        displayName: getAppDisplayName(data),
      })}`;
    }
    if (reportedError?.code) {
      return getReportedError(reportedError, installerStatusCodes.current.error, t);
    }
    return getReportedProgress(reportedStatus, installerStatusCodes.current.status, t);
  }, [data, isInstalled, reportedError, reportedStatus, t]);

  const action = useMemo(() => {
    if (isInstalled) {
      return {
        label: t('Open the app'),
        onClick: () => {
          getCorePlugins().routing.navigateTo({
            appName: decodeName.current(appId),
          });
        },
      };
    }
    if (reportedError?.code && reportedError?.retryable) {
      return {
        label: t('Retry'),
        onClick: () => installer.current.retryFromError(reportedError.code),
      };
    }
    return {
      label: t('Cancel installation'),
      onClick: () => installer.current.cancelInstallation(),
    };
  }, [appId, getCorePlugins, isInstalled, reportedError, reportedStatus, t]);

  if (error) {
    return (
      <ErrorLoader
        type="no-apps"
        title={t('Error loading app')}
        details={t('Looks like this app is not available to install.')}
      />
    );
  }
  return (
    <>
      {(isAuthenticating || loading) && <div>Loading...</div>}
      {!authenticatedDID && !isAuthenticating && called && !loading && (
        <ErrorLoader
          type="not-authenticated"
          title={t('Login Required')}
          details={t('You must be logged in to install {{appDisplayName}}', {
            appDisplayName: getAppDisplayName(data),
          })}
        >
          <Button label={t('Login')} onClick={handleLoginClick} />
        </ErrorLoader>
      )}
      {authenticatedDID && called && !loading && (
        <InstallApp
          title={isInstalled ? t('Application installed') : t('Installation in progress')}
          appName={getAppDisplayName(data)}
          progressInfo={progressInfo}
          status={installStatus}
          action={action}
        />
      )}
    </>
  );
};

const getAppDisplayName = (respData: GetAppsByPublisherDidQuery) => {
  if (respData?.node && 'akashaAppList' in respData.node) {
    return respData.node.akashaAppList.edges[0]?.node.displayName;
  }
};
