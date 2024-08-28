import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import routes, { CREATE_EXTENSION, MY_EXTENSIONS } from '../../routes';
import { useRootComponentProps, useAkashaStore } from '@akashaorg/ui-awf-hooks';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import AppCreationForm from '@akashaorg/design-system-components/lib/components/AppCreationForm';
import { DRAFT_EXTENSIONS } from '../../constants';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Button from '@akashaorg/design-system-core/lib/components/Button';

export const ExtensionCreationPage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const { uiEvents } = useRootComponentProps();

  const { baseRouteName, getRoutingPlugin } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  // const [createAppMutation, { loading }] = useCreateAppMutation({
  //   context: { source: sdk.current.services.gql.contextSources.composeDB },
  // });

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
            extensionSourceURLLabel={t('Extension Source URL')}
            cancelButton={{
              label: 'Cancel',
              disabled: false,
              handleClick: () => {
                navigate({
                  to: routes[MY_EXTENSIONS],
                });
              },
            }}
            createButton={{
              label: 'Create',

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
                const existingDraftExtensions =
                  JSON.parse(localStorage.getItem(`${DRAFT_EXTENSIONS}-${authenticatedDID}`)) || [];
                localStorage.setItem(
                  `${DRAFT_EXTENSIONS}-${authenticatedDID}`,
                  JSON.stringify([...existingDraftExtensions, newExtension]),
                );

                uiEvents.next({
                  event: NotificationEvents.ShowNotification,
                  data: {
                    type: NotificationTypes.Success,
                    title: t('Extension created successfully!'),
                  },
                });

                navigate({
                  to: routes[MY_EXTENSIONS],
                });
              },
            }}
          />
        </Stack>
      </Stack>
    </Card>
  );
};
