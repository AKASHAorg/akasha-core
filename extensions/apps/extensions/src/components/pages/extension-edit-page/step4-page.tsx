import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { Extension, NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import { DRAFT_EXTENSIONS } from '../../../constants';

type ExtensionEditStep4PageProps = {
  extensionId: string;
};

export const ExtensionEditStep4Page: React.FC<ExtensionEditStep4PageProps> = ({ extensionId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const { uiEvents } = useRootComponentProps();

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const formValue = useMemo(
    () => JSON.parse(sessionStorage.getItem(extensionId)) || {},
    [extensionId],
  );

  const existingDraftExtensions: Extension[] = useMemo(
    () => JSON.parse(localStorage.getItem(`${DRAFT_EXTENSIONS}-${authenticatedDID}`)) || [],
    [authenticatedDID],
  );

  const handleUpdateExtension = () => {
    const newDraftExtensions = existingDraftExtensions.map(oldDraftExt =>
      oldDraftExt.id === extensionId ? { ...oldDraftExt, ...formValue } : oldDraftExt,
    );
    localStorage.setItem(
      `${DRAFT_EXTENSIONS}-${authenticatedDID}`,
      JSON.stringify(newDraftExtensions),
    );
    sessionStorage.removeItem(extensionId);
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
          />
          <Button variant="primary" label={t('Update')} onClick={handleUpdateExtension} />
        </Stack>
      </Stack>
    </Stack>
  );
};
