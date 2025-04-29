import React from 'react';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Checkbox } from '@akashaorg/ui/lib/components/checkbox';

export interface IAppSettingProps {
  title;
  description;
  // data
  isSelected: boolean;
  // handlers
  onChange?: (checked: boolean) => void;
}

const AppSetting: React.FC<IAppSettingProps> = ({ title, description, isSelected, onChange }) => {
  return (
    <Stack>
      <Stack direction="row" justifyContent="between" alignItems="center">
        <Text variant="body1">{title}</Text>
        <Checkbox
          id="checkbox"
          value="app-setting"
          name="app-setting"
          checked={isSelected}
          onCheckedChange={onChange}
          className="w-6 h-6"
        />
      </Stack>

      <Text variant="footnotes2" weight="normal" customStyle="dark:text-grey6 text-grey4 mt-2">
        {description}
      </Text>
    </Stack>
  );
};

export default AppSetting;
