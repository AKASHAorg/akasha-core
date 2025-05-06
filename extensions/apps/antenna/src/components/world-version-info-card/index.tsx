import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type TWorldVersionInfoCard = {
  titleLabel: string;
  description: string;
  onDismissCard: () => void;
};
const WorldVersionInfoCard: React.FC<TWorldVersionInfoCard> = props => {
  const { titleLabel, description, onDismissCard } = props;
  return (
    <Stack spacing={1} className="p-4 bg-warningLight/30 dark:bg-warningDark/30 rounded-3xl">
      <Stack direction="row" alignItems="center" justifyContent="between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Icon icon={<ExclamationTriangleIcon />} size="sm" />
          <Typography variant="sm" bold>
            {titleLabel}
          </Typography>
        </Stack>
        <Button plain={true} onClick={onDismissCard}>
          <Icon icon={<XMarkIcon />} size="sm" />
        </Button>
      </Stack>
      <Typography variant="sm" className="font-light">
        {description}
      </Typography>
    </Stack>
  );
};
export default WorldVersionInfoCard;
