import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@akashaorg/ui-core-hooks';
import {
  MoonIcon,
  SunIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
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
          <Typography bold>{t('What mode are you feeling today?')}</Typography>

          <Toggle
            checked={theme === 'Light-Theme'}
            iconChecked={<SunIcon />}
            iconUnchecked={<MoonIcon />}
            onChange={handleThemeSelect}
          />
        </Stack>

        <Typography>
          {t('You can change your theme between dark mode or light mode! Which side are you on 😼')}
        </Typography>
      </Stack>
    </PageLayout>
  );
};
export default ThemeOption;
