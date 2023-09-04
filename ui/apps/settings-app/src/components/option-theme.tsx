import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';

import PageLayout from './base-layout';
import { BaseOption } from './settings-page';

export interface IThemeOption extends BaseOption {
  themeIntroLabel: string;
  themeSubtitleLabel: string;
  theme: string;
  onThemeSelect: () => void;
}

const ThemeOption: React.FC<IThemeOption> = props => {
  const { titleLabel, themeIntroLabel, themeSubtitleLabel, theme, onThemeSelect } = props;

  return (
    <PageLayout title={titleLabel}>
      <Stack customStyle="p-4">
        <Stack justify="between" align="center" customStyle="mb-2">
          <Text weight="bold">{themeIntroLabel}</Text>

          <Toggle
            checked={theme === 'Light-Theme'}
            iconChecked="SunIcon"
            iconUnchecked="MoonIcon"
            onChange={onThemeSelect}
          />
        </Stack>

        <Text>{themeSubtitleLabel}</Text>
      </Stack>
    </PageLayout>
  );
};

export default ThemeOption;
