import React from 'react';
import DS from '@akashaorg/design-system';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import PageLayout from './base-layout';
import { BaseOption } from './settings-page';

const { Checkbox } = DS;

export interface IAppearanceOption extends BaseOption {
  themeIntroLabel: string;
  themeSubtitleLabel: string;
  theme: string;
  onThemeSelect: () => void;
}

const AppearanceOption: React.FC<IAppearanceOption> = props => {
  const { titleLabel, themeIntroLabel, themeSubtitleLabel, theme, onThemeSelect } = props;

  return (
    <PageLayout title={titleLabel}>
      <Box customStyle="p-4">
        <Box customStyle="flex justify-between items-center mb-2">
          <Text weight="bold">{themeIntroLabel}</Text>

          <Checkbox checked={theme === 'Light-Theme'} onChange={onThemeSelect} toggle={true} />
        </Box>

        <Text>{themeSubtitleLabel}</Text>
      </Box>
    </PageLayout>
  );
};

export default AppearanceOption;
