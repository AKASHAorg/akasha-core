import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Checkbox } from '@akashaorg/ui/lib/components/checkbox';
export interface IEnableAllSettingProps {
  // data
  isSelected: boolean;
  // handlers
  onChange?: (checked: boolean) => void;
}

const EnableAllSetting: React.FC<IEnableAllSettingProps> = ({ isSelected, onChange }) => {
  const { t } = useTranslation('app-settings-ewa');

  return (
    <Stack className="mb-4">
      <Stack direction="row" justifyContent="between" alignItems="center" className="my-4">
        <Text variant="body1">{t('Enable all')}</Text>
        <Checkbox
          id="enable-all-notifications-checkbox"
          value="Enable all"
          name="enable-all"
          checked={isSelected}
          onCheckedChange={onChange}
          className="w-6 h-6"
        />
      </Stack>
    </Stack>
  );
};

export default EnableAllSetting;
