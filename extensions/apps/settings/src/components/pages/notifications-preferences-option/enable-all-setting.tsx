import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
export interface IEnableAllSettingProps {
  // data
  isSelected: boolean;
  // handlers
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}
const EnableAllSetting: React.FC<IEnableAllSettingProps> = ({ isSelected, onChange }) => {
  const { t } = useTranslation('app-settings-ewa');
  return (
    <Stack className="mb-4">
      <Stack direction="row" justifyContent="between" alignItems="center" className="my-4">
        <Typography>{t('Enable all')}</Typography>
        <Checkbox
          id="enable-all-notifications-checkbox"
          value="Enable all"
          name="enable-all"
          isSelected={isSelected}
          handleChange={onChange}
          size="large"
          customStyle="w-6 h-6"
        />
      </Stack>
    </Stack>
  );
};
export default EnableAllSetting;
