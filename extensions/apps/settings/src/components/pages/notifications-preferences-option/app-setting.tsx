import React from 'react';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
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
        <Typography>{title}</Typography>
        <Checkbox
          id="checkbox"
          value="app-setting"
          name="app-setting"
          checked={isSelected}
          onCheckedChange={onChange}
          className="w-6 h-6"
        />
      </Stack>

      <Typography variant="xs" className="font-medium font-normal dark:text-grey6 text-grey4 mt-2">
        {description}
      </Typography>
    </Stack>
  );
};
export default AppSetting;
