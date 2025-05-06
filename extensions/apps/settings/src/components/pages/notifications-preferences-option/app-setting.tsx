import React from 'react';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
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
    <Stack>
      <Stack direction="row" justifyContent="between" alignItems="center">
        <Typography>{title}</Typography>
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

      <Typography variant="xs" className="font-medium font-normal dark:text-grey6 text-grey4 mt-2">
        {description}
      </Typography>
    </Stack>
  );
};
export default AppSetting;
