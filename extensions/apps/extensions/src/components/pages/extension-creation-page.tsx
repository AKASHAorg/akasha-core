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
import { NotConnnected } from '../not-connected';
import { DRAFT_EXTENSIONS } from '../../constants';

export const ExtensionCreationPage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const { uiEvents } = useRootComponentProps();

  // const [createAppMutation, { loading }] = useCreateAppMutation({
  //   context: { source: sdk.current.services.gql.contextSources.composeDB },
  // });

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  if (!authenticatedDID) {
    return (
      <NotConnnected
        description={t('To create an extension you must be connected ⚡️')}
        redirectRoute={routes[CREATE_EXTENSION]}
      />
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
