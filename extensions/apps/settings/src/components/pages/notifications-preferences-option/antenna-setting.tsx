import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Info } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
export interface IAntennaSettingProps {
  // data
  isSelected: boolean;
  // handlers
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}
const AntennaSetting: React.FC<IAntennaSettingProps> = ({ isSelected, onChange }) => {
  const { t } = useTranslation('app-settings-ewa');
  return (
    <Stack>
      <Stack direction="row" justifyContent="between" alignItems="center">
        <Typography>{t('Antenna')}</Typography>
        <Checkbox
          id="antenna-checkbox"
          value="Antenna"
          name="antenna"
          isSelected={isSelected}
          handleChange={onChange}
          size="large"
          customStyle="w-6 h-6"
        />
      </Stack>

      <Typography variant="xs" className="font-medium font-normal dark:text-grey6 text-grey4 mt-2">
        {t(
          'Get notifications about new reflections on your beams people you follow & your interests.',
        )}
      </Typography>
      <Card className="p-3 mt-4">
        <Stack direction="row" spacing={3} alignItems="center">
          <Icon
            icon={<Info />}
            size="lg"
            solid={true}
            customStyle="[&>*]:fill-secondaryLight dark:[&>*]:fill-secondaryDark"
          />
          <Typography className="text-sm">
            {t('Changing notifications preferences requires a signature')}
          </Typography>
        </Stack>
      </Card>
    </Stack>
  );
};
export default AntennaSetting;
