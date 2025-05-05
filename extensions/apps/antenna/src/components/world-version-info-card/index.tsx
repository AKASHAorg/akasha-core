import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { TriangleAlertIcon, XIcon } from 'lucide-react';
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
          <TriangleAlertIcon className="h-4 w-4 [&>*]:stroke-warningLight dark:[&>*]:stroke-warningDark" />
          <Text variant="button-md">{titleLabel}</Text>
        </Stack>
        <Button plain={true} onClick={onDismissCard}>
          <XIcon className="h-4 w-4 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
        </Button>
      </Stack>
      <Text variant="body2" weight="light">
        {description}
      </Text>
    </Stack>
  );
};

export default WorldVersionInfoCard;
