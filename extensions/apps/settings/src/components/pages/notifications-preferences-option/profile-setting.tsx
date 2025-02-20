import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';

export interface IProfileSettingProps {
  // data
  isSelected: boolean;
  // handlers
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileSetting: React.FC<IProfileSettingProps> = ({ isSelected, onChange }) => {
  const { t } = useTranslation('app-settings-ewa');

  return (
    <Stack className="border-b border-border mb-4 pb-4">
      <Stack direction="row" justifyContent="between" alignItems="center" className="mt-4">
        <Text variant="body1">{t('Profile')}</Text>
        <Checkbox
          id="profile-checkbox"
          value="Profile"
          name="profile"
          isSelected={isSelected}
          handleChange={onChange}
          size="large"
          customStyle="w-6 h-6"
        />
      </Stack>

      <Text variant="footnotes2" weight="normal" customStyle="dark:text-grey6 text-grey4 mt-2">
        {t('Get notifications about new followers')}
      </Text>
    </Stack>
  );
};

export default ProfileSetting;
