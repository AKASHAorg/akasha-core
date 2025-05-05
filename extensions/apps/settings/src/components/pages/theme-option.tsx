import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@akashaorg/ui-core-hooks';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';

import PageLayout from './base-layout';

export type theme = 'Light-Theme' | 'Dark-Theme';

const ThemeOption: React.FC = () => {
  const { t } = useTranslation('app-settings-ewa');

  const { theme, propagateTheme } = useTheme();

  const handleThemeSelect = () => {
    const selectedTheme = theme === 'Dark-Theme' ? 'Light-Theme' : 'Dark-Theme';

    propagateTheme(selectedTheme, true);
  };

  return (
    <PageLayout title={t('Theme')}>
      <Stack spacing={2} className="p-4">
        <Stack direction="row" justifyContent="between" alignItems="center">
          <Text weight="bold">{t('What mode are you feeling today?')}</Text>

          <Toggle
            checked={theme === 'Light-Theme'}
            iconChecked={<SunIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />}
            iconUnchecked={<MoonIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />}
            onChange={handleThemeSelect}
          />
        </Stack>

        <Text>
          {t('You can change your theme between dark mode or light mode! Which side are you on 😼')}
        </Text>
      </Stack>
    </PageLayout>
  );
};

export default ThemeOption;
