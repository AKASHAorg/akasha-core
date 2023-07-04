import * as React from 'react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { useTranslation } from 'react-i18next';

const NoAppsMessage = () => {
  const { t } = useTranslation('app-akasha-verse');
  return (
    <Stack direction="column" align="center" spacing="gap-y-4" customStyle="px-4">
      <Icon
        type="DeviceTabletIcon"
        size="lg"
        customStyle="p-4 bg(grey6 dark:grey5) rounded-xl mr-4"
      />
      <Text variant="button-lg">{t('You have no installed apps')}</Text>
      <Text variant="subtitle2">{t('Try some out for extra functionality!')}</Text>
    </Stack>
  );
};

export default NoAppsMessage;