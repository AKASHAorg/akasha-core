import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

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
          <Icon icon={<ExclamationTriangleIcon />} size="sm" customStyle="[&>*]:stroke-white" />
          <Text variant="button-md">{titleLabel}</Text>
        </Stack>
        <Button plain={true} onClick={onDismissCard}>
          <Icon icon={<XMarkIcon />} size="sm" />
        </Button>
      </Stack>
      <Text variant="body2" weight="light">
        {description}
      </Text>
    </Stack>
  );
};

export default WorldVersionInfoCard;
