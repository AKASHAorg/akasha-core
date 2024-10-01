import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import routes, { CREATE_EXTENSION, MY_EXTENSIONS } from '../../../routes';
import { useRootComponentProps, useAkashaStore } from '@akashaorg/ui-awf-hooks';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import AppCreationForm from '@akashaorg/design-system-components/lib/components/AppCreationForm';
import { DRAFT_EXTENSIONS } from '../../../constants';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { Extension, NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import { useGetAppsQuery } from '@akashaorg/ui-awf-hooks/lib/generated';
import { selectAkashaApp } from './utils';

export const ExtensionCreationPage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

  const { uiEvents, baseRouteName, getCorePlugins } = useRootComponentProps();
  const uiEventsRef = React.useRef(uiEvents);
  const navigateTo = getCorePlugins().routing.navigateTo;

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${routes[CREATE_EXTENSION]}`,
        }).toString()}`;
      },
    });
  };

  const showErrorNotification = React.useCallback((title: string) => {
    uiEventsRef.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        title,
      },
    });
  }, []);

  const draftExtensions: Extension[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(`${DRAFT_EXTENSIONS}-${authenticatedDID}`)) || [];
    } catch (error) {
      showErrorNotification(error);
    }
  }, [authenticatedDID, showErrorNotification]);

  const [currentExtName, setCurrentExtName] = useState('');

  const {
    data: appInfo,
    loading: loadingAppInfo,
    error: appInfoQueryError,
  } = useGetAppsQuery({
    variables: {
      first: 1,
      filters: { where: { name: { equalTo: currentExtName } } },
    },
    skip: !currentExtName,
  });

  const handleCheckExtName = (fieldValue: string) => {
    setCurrentExtName(fieldValue);
  };

  const isDuplicateLocalExtName = useMemo(
    () => !!draftExtensions.find(ext => ext.name === currentExtName),
    [draftExtensions, currentExtName],
  );

  const isDuplicatePublishedExtName = useMemo(() => !!selectAkashaApp(appInfo), [appInfo]);

  useEffect(() => {
    if (appInfoQueryError) {
      showErrorNotification(appInfoQueryError.message);
    }
  }, [appInfoQueryError, showErrorNotification]);

  if (!authenticatedDID) {
    return (
      <ErrorLoader
        type="not-authenticated"
        title={`${t('Uh-oh')}! ${t('You are not connected')}!`}
        details={`${t('To create an extension you must be connected')} ⚡️`}
      >
        <Button variant="primary" label={t('Connect')} onClick={handleConnectButtonClick} />
      </ErrorLoader>
    );
  }

  return (
    <Card padding="py-4 px-0" margin="mb-2">
      <Stack spacing="gap-y-4">
        <Text variant="h5" weight="semibold" align="center">
          {t('Create an Extension')}
        </Text>
        <Divider />
        <Stack>
          <AppCreationForm
            extensionDisplayNameFieldLabel={t('Extension Display Name')}
            extensionDisplayNamePlaceholderLabel={t('extension x')}
            extensionNameFieldLabel={t('Extension ID')}
            extensionNamePlaceholderLabel={t('unique extension identifier')}
            extensionLicenseFieldLabel={t('Extension License')}
            extensionLicenseOtherPlaceholderLabel={t('Please specify your license type')}
            extensionTypeFieldLabel={t('Extension Type')}
            extensionSourceURLLabel={t('Source URL')}
            disclaimerLabel={t(
              `Don't worry if you don't have all the information now. You can add or edit all details later when submitting or editing the app.`,
            )}
            handleCheckExtName={handleCheckExtName}
            isDuplicateExtName={isDuplicateLocalExtName || isDuplicatePublishedExtName}
            loading={loadingAppInfo}
            cancelButton={{
              label: t('Cancel'),
              disabled: false,
              handleClick: () => {
                navigate({
                  to: routes[MY_EXTENSIONS],
                });
              },
            }}
            createButton={{
              label: t('Create locally'),
              handleClick: data => {
                const newExtension = {
                  id: crypto.randomUUID(),
                  applicationType: data?.extensionType,
                  createdAt: new Date().toISOString(),
                  description: '',
                  displayName: data?.extensionDisplayName,
                  license: data?.extensionLicense,
                  name: data?.extensionID,
                  localDraft: true,
                  sourceURL: data?.extensionSourceURL,
                };

                localStorage.setItem(
                  `${DRAFT_EXTENSIONS}-${authenticatedDID}`,
                  JSON.stringify([...draftExtensions, newExtension]),
                );

                navigate({
                  to: `/create-extension/$extensionId`,
                  params: { extensionId: newExtension.id },
                });
              },
            }}
          />
        </Stack>
      </Stack>
    </Card>
  );
};
