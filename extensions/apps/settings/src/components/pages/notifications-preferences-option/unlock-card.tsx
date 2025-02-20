import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Lock } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

export interface IUnlockCardProps {
  // data
  loading?: boolean;
  // handlers
  onClick?: () => void;
}

const UnlockCard: React.FC<IUnlockCardProps> = ({ onClick, loading }) => {
  const { t } = useTranslation('app-settings-ewa');

  return (
    <Card className="p-3">
      <Stack direction="row" spacing={3}>
        <Icon
          icon={<Lock />}
          size="md"
          solid={true}
          color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
        />
        <Stack direction="column" spacing={1}>
          <Text variant="button-md" color={{ dark: 'white', light: 'black' }}>
            {t('Unlock preferences')}
          </Text>
          <Text variant="body2" color={{ dark: 'white', light: 'black' }}>
            {t('Click “Unlock” to unlock preferences. You will be prompted with 1 signature.')}
          </Text>
          {
            <Button onClick={onClick} variant="link" loading={loading} className="mr-auto">
              {t('Unlock')}
            </Button>
          }
        </Stack>
      </Stack>
    </Card>
  );
};

export default UnlockCard;
