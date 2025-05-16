import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import ExtensionReleasePublishForm from '../../extension-release-publish-form';
import { DRAFT_EXTENSIONS, DRAFT_RELEASES } from '../../../constants';
import { NetworkStatus } from '@apollo/client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
} from '@akashaorg/ui/lib/components/alert-dialog';
import { Loader2 } from 'lucide-react';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
type EditTestReleasePageProps = {
  extensionId: string;
  networkStatus: NetworkStatus;
  extensionName?: string;
  extensionType?: AkashaAppApplicationType;
};
const getDraftExtension = (extensionId: string, authenticatedDID: string) => {
  try {
    const draftExtensions = JSON.parse(
      localStorage.getItem(`${DRAFT_EXTENSIONS}-${authenticatedDID}`),
    );
    if (!draftExtensions) {
      return null;
    }
    return draftExtensions.find(ext => ext.id === extensionId);
  } catch (error) {
    return error;
  }
};
export const EditTestReleasePage: React.FC<EditTestReleasePageProps> = ({
  extensionId,
  extensionName,
  extensionType,
  networkStatus,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const { uiEvents, baseRouteName, getCorePlugins } = useRootComponentProps();
  const navigateTo = getCorePlugins().routing.navigateTo;
  const uiEventsRef = React.useRef(uiEvents);
  const [isLoadingTestMode, setIsLoadingTestMode] = useState(false);
  const testModeRedirectUrl = useRef<string>();
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const showErrorNotification = React.useCallback((title: string) => {
    uiEventsRef.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        title,
      },
    });
  }, []);
  const draftReleases = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(`${DRAFT_RELEASES}-${authenticatedDID}`)) || [];
    } catch (error) {
      showErrorNotification(error);
    }
  }, [authenticatedDID, showErrorNotification]);
  const localRelease = draftReleases.find(release => release.applicationID === extensionId);
  const draftExtension = getDraftExtension(extensionId, authenticatedDID);
  const draftExtensionError = draftExtension instanceof Error || false;
  const baseAppInfo = useMemo(() => {
    if (draftExtension) {
      return {
        id: draftExtension.id,
        name: draftExtension.name,
        applicationType: draftExtension.applicationType,
      };
    }
    // if a published extension exists for this id use the data from it
    if (networkStatus === NetworkStatus.ready && extensionName && extensionType) {
      return {
        id: extensionId,
        name: extensionName,
        applicationType: extensionType,
      };
    }
  }, [draftExtension, networkStatus, extensionName, extensionType, extensionId]);
  useEffect(() => {
    if (draftExtensionError) {
      showErrorNotification(draftExtension);
    }
  }, [draftExtension, draftExtensionError, showErrorNotification]);
  useEffect(() => {
    const testModeLoader = getCorePlugins().testModeLoader;
    let unsubscribe;
    let timeout;
    if (testModeLoader) {
      unsubscribe = testModeLoader.subscribe(({ currentStatus }) => {
        if (
          currentStatus &&
          currentStatus ===
            getCorePlugins().testModeLoader.getStaticStatusCodes().status
              .EXTENSION_TEST_LOAD_SUCCESS
        ) {
          timeout = setTimeout(() => {
            window.location.href = `${window.location.origin}/${testModeRedirectUrl.current}`;
          }, 3000);
        }
      });
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [baseAppInfo, getCorePlugins, navigateTo]);
  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/release-manager/${extensionId}/edit-test-release`,
        }).toString()}`;
      },
    });
  };
  const handleClickSubmit = appReleaseFormData => {
    // remove the old local test release so we can update it
    const newLocalDraftReleases = draftReleases.filter(
      draftRelease => draftRelease.applicationID !== extensionId,
    );
    // update the local draft release to reflect the form data
    const newLocalRelease = {
      ...localRelease,
      version: appReleaseFormData?.versionNumber,
      source: appReleaseFormData?.sourceURL,
      description: appReleaseFormData?.description,
    };
    // save the new list of local draft releases in local storage
    localStorage.setItem(
      `${DRAFT_RELEASES}-${authenticatedDID}`,
      JSON.stringify([...newLocalDraftReleases, newLocalRelease]),
    );
    const testModeLoader = getCorePlugins().testModeLoader;
    if (!baseAppInfo) {
      return showErrorNotification(`This release does not belong to an extension.`);
    }
    testModeLoader.load({
      applicationID: localRelease.applicationID,
      source: appReleaseFormData.sourceURL,
      appName: baseAppInfo.name,
      applicationType: baseAppInfo.applicationType,
    });
    testModeRedirectUrl.current = `${baseAppInfo.name}`;
    setIsLoadingTestMode(true);
  };
  const handleClickCancel = () => {
    navigate({
      to: '/release-manager/$extensionId',
      params: {
        extensionId,
      },
    });
  };
  if (!authenticatedDID) {
    return (
      <ErrorLoader type="not-authenticated">
        <ErrorLoaderTitle>{`${t('Uh-oh')}! ${t('You are not connected')}!`}</ErrorLoaderTitle>
        <ErrorLoaderDescription>{`${t('To check your extensions you must be connected')} ⚡️`}</ErrorLoaderDescription>
        <ErrorLoaderFooter>
          <Button onClick={handleConnectButtonClick}>{t('Connect')}</Button>
        </ErrorLoaderFooter>
      </ErrorLoader>
    );
  }
  return (
    <>
      <AlertDialog defaultOpen={isLoadingTestMode}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogDescription>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <Typography variant="sm" className="px-4 py-2">
                {t('Loading test mode')}
              </Typography>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
      <Card className="shadow-none p-0">
        <Stack spacing={2}>
          <Stack className="p-4">
            <Typography variant="h5" className="font-semibold text-center">
              {t('Release Notes')}
            </Typography>
            <ExtensionReleasePublishForm
              defaultValues={{
                versionNumber: localRelease?.version || '',
                description: localRelease?.description || '',
                sourceURL: '',
              }}
              validationLabels={{
                version: t('Version should follow Semantic Versioning standard'),
                descriptionMin: t('Must be at least 10 characters'),
                descriptionMax: t('Must be less than 2000 characters'),
                sourceURL: t('URL is required'),
              }}
              versionNumberLabel={t('Version Number')}
              descriptionFieldLabel={t('Description')}
              descriptionPlaceholderLabel={t('A brief description about this release')}
              sourceURLFieldLabel={t('Source URL')}
              sourceURLPlaceholderLabel={t('Webpack dev server / ipfs')}
              cancelButton={{
                label: t('Cancel'),
                handleClick: handleClickCancel,
              }}
              nextButton={{
                label: t('Test Release'),
                handleClick: handleClickSubmit,
              }}
            />
          </Stack>
        </Stack>
      </Card>
    </>
  );
};
