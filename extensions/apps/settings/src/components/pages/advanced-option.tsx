import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDevMode } from '@akashaorg/ui-awf-hooks';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';

import PageLayout from './base-layout';

const AdvancedOption: React.FC = () => {
  const { t } = useTranslation('app-settings-ewa');

  const { devMode, propagateDevMode } = useDevMode();

  const handleToggleDevMode = () => {
    return propagateDevMode(!devMode);
  };

  return (
    <PageLayout title={t('Advanced')}>
      <Stack padding="p-4" spacing="gap-y-2">
        <Stack direction="row" justify="between" align="center" customStyle="mb-2">
          <Text weight="bold">{t('Extensions Developer Mode')}</Text>

          <Toggle checked={!!devMode} onChange={handleToggleDevMode} />
        </Stack>
        <Text as="span" color={{ light: 'grey4', dark: 'grey6' }}>
          {`🌟 ${t("When you enable Dev Mode, you'll unlock the ability to create awesome extensions in the Extensions app! 🚀 Once enabled, a new submenu item called")} `}
          <Text as="span" weight="bold">
            {`"${t('My Extensions')}"`}
          </Text>
          {` ${t('will appear under the Extensions app')}. 💻✨`}
        </Text>
      </Stack>
    </PageLayout>
  );
};

export default AdvancedOption;
