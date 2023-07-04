import React from 'react';
import { useTranslation } from 'react-i18next';

import { RootComponentProps } from '@akashaorg/typings/ui';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import menuRoute, { DEV_KEYS } from '../routes';
import { CardWrapper, DevMessageForm } from '../components/common';

export const EditMessageName: React.FC<RootComponentProps> = props => {
  const { plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const { t } = useTranslation('app-profile');

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
      <Box customStyle="p-4 space-y-4">
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
      </Box>
    </CardWrapper>
  );
};
