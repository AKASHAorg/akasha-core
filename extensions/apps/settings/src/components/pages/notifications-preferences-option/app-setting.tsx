import React from 'react';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';

export interface IAppSettingProps {
  title;
  description;
  // data
  isSelected: boolean;
  // handlers
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

const AppSetting: React.FC<IAppSettingProps> = ({ title, description, isSelected, onChange }) => {
  return (
    <Stack className="border-b border-border mb-4 pb-4">
      <Stack direction="row" justifyContent="between" alignItems="center" className="mt-4">
        <Text variant="body1">{title}</Text>
        <Checkbox
          id="checkbox"
          value="app-setting"
          name="app-setting"
          isSelected={isSelected}
          handleChange={onChange}
          size="large"
          customStyle="w-6 h-6"
        />
      </Stack>

      <Text variant="footnotes2" weight="normal" customStyle="dark:text-grey6 text-grey4 mt-2">
        {description}
      </Text>
    </Stack>
  );
};

export default AppSetting;
