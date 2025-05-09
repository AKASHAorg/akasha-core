import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Lock } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { LockIcon } from 'lucide-react';
export interface IUnlockCardProps {
  // data
  loading?: boolean;
  // handlers
  onClick?: () => void;
}
const UnlockCard: React.FC<IUnlockCardProps> = ({ onClick, loading }) => {
  const { t } = useTranslation('app-settings-ewa');
  return (
    <Card className="p-4">
      <Stack direction="row" spacing={3}>
        <LockIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
        <Stack direction="column" spacing={1}>
          <Typography variant="sm" bold className="text-black dark:text-white">
            {t('Unlock preferences')}
          </Typography>
          <Typography variant="sm" className="text-black dark:text-white">
            {t('Click “Unlock” to unlock preferences. You will be prompted with 1 signature.')}
          </Typography>
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
