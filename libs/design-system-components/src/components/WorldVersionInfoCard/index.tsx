import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type TWorldVersionInfoCard = {
  titleLabel: string;
  description: string;
  onDismissCard: () => void;
};

const WorldVersionInfoCard: React.FC<TWorldVersionInfoCard> = props => {
  const { titleLabel, description, onDismissCard } = props;

  return (
    <Stack
      spacing="gap-y-3"
      padding="p-4"
      background={{ light: 'warningLight/30', dark: 'warningDark/30' }}
      customStyle="rounded-3xl"
    >
      <Stack direction="row" align="center" justify="between">
        <Stack direction="row" align="center" spacing="gap-x-2">
          <Icon icon={<ExclamationTriangleIcon />} size="sm" />
          <Text variant="button-sm">{titleLabel}</Text>
        </Stack>
        <Button plain={true} onClick={onDismissCard}>
          <Icon icon={<XMarkIcon />} size="sm" />
        </Button>
      </Stack>
      <Text variant="footnotes2" weight="light">
        {description}
      </Text>
    </Stack>
  );
};

export default WorldVersionInfoCard;
