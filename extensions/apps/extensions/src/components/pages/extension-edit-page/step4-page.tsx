import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { AtomContext, FormData } from './main-page';
import { useAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import getSDK from '@akashaorg/awf-sdk';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import { useUpdateAppMutation } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

type ExtensionEditStep4PageProps = {
  extensionId: string;
};

export const ExtensionEditStep4Page: React.FC<ExtensionEditStep4PageProps> = ({ extensionId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const { uiEvents } = useRootComponentProps();

  const sdk = React.useRef(getSDK());

  const [formValue, setForm] = useAtom<FormData>(useContext(AtomContext));

  const [updateAppMutation, { loading: updateLoading }] = useUpdateAppMutation({
    context: { source: sdk.current.services.gql.contextSources.composeDB },
  });

  const handleUpdateExtension = () => {
    updateAppMutation({
      variables: {
        i: {
          id: extensionId,
          content: {
            ...formValue,
          },
        },
      },
      onCompleted: () => {
        setForm(RESET);
        uiEvents.next({
          event: NotificationEvents.ShowNotification,
          data: {
            type: NotificationTypes.Success,
            title: t('Extension Info Updated'),
            description: `${t('Data fields for this extension were updated')}`,
          },
        });
        navigate({
          to: '/my-extensions',
        });
      },
      onError: () => {
        uiEvents.next({
          event: NotificationEvents.ShowNotification,
          data: {
            type: NotificationTypes.Error,
            title: t('Extension Info Update Failed'),
            description: `${t('An Error Occured')}`,
          },
        });
      },
    });
  };
  return (
    <Stack spacing="gap-y-4">
      <Text variant="h5" weight="semibold" align="center">
        {t('Review and Publish')}
      </Text>

      <Stack>
        <Stack direction="row" justify="end" spacing="gap-x-2" customStyle="px-4 pb-4">
          <Button
            variant="text"
            label={t('Back')}
            onClick={() => {
              navigate({
                to: '/edit-extension/$extensionId/step3',
              });
            }}
            disabled={updateLoading}
          />
          <Button
            variant="primary"
            label={t('Update')}
            disabled={updateLoading}
            onClick={handleUpdateExtension}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
