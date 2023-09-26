import React from 'react';
import { useTranslation } from 'react-i18next';

import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import menuRoute, { DEV_KEYS } from '../routes';
import { CardWrapper, DevMessageForm } from '../components/common';

export const EditMessageName: React.FC<unknown> = () => {
  const { t } = useTranslation('app-profile');

  const { getRoutingPlugin } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const handleCancel = () => {
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[DEV_KEYS],
    });
  };

  const handleSave = () => {
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[DEV_KEYS],
    });
  };

  return (
    <CardWrapper
      titleLabel={t('Editing a Message')}
      cancelButtonLabel={t('Cancel')}
      confirmButtonLabel={t('Save')}
      onCancelButtonClick={handleCancel}
      onConfirmButtonClick={handleSave}
    >
      <Stack spacing="gap-y-4" customStyle="p-4">
        <Text variant="body2">
          {t(
            'You can only edit the name of your message, but you cannot edit the generated message.  If you wish, you can delete it and generate a new one.',
          )}
        </Text>

        <DevMessageForm
          messageNameTitleLabel={t('Message name')}
          messageNameInputPlaceholder={t('Give your message a name (optional)')}
          messageTitleLabel={t('Message')}
          messageInputPlaceholder={t('Paste the generated message here')}
          validationStatus={{
            isError: false,
            extraInfo: t('Messages cannot be edited, but you can delete them and add a new one.'),
          }}
        />
      </Stack>
    </CardWrapper>
  );
};
