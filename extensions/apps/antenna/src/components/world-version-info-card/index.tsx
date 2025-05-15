import React from 'react';
import { TriangleAlertIcon, XIcon } from 'lucide-react';
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
          <TriangleAlertIcon className="h-4 w-4 [&>*]:stroke-warningLight dark:[&>*]:stroke-warningDark" />
          <Typography variant="sm" bold>
            {titleLabel}
          </Typography>
        </Stack>
        <button onClick={onDismissCard}>
          <XIcon className="h-4 w-4 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
        </button>
      </Stack>
      <Typography variant="sm" className="font-light">
        {description}
      </Typography>
    </Stack>
  );
};
export default WorldVersionInfoCard;
