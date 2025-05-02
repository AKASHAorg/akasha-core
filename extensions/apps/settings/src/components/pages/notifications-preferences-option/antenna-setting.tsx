import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Info } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import { InfoIcon } from 'lucide-react';

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
        <Text variant="body1">{t('Antenna')}</Text>
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

      <Text variant="footnotes2" weight="normal" customStyle="dark:text-grey6 text-grey4 mt-2">
        {t(
          'Get notifications about new reflections on your beams people you follow & your interests.',
        )}
      </Text>
      <Card className="p-3 mt-4">
        <Stack direction="row" spacing={3} alignItems="center">
          <InfoIcon className="h-6 w-6 [&>*]:fill-secondaryLight dark:[&>*]:fill-secondaryDark" />
          <Text variant="body1" customStyle="text-sm">
            {t('Changing notifications preferences requires a signature')}
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
};

export default AntennaSetting;
