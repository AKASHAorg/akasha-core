import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type BecomeModeratorCardProps = {
  titleLabel: string;
  subtitleLabel: string;
  buttonLabel: string;
  onClickApply: () => void;
};
const BecomeModeratorCard: React.FC<BecomeModeratorCardProps> = props => {
  const { titleLabel, subtitleLabel, buttonLabel, onClickApply } = props;
  return (
    <Card className="p-4">
      <Stack spacing={6}>
        <Typography variant="h5" bold>
          {titleLabel}
        </Typography>
        <Typography variant="sm" className="font-light text-grey5 dark:text-grey6">
          {subtitleLabel}
        </Typography>
        <Button size="sm" className="w-fit self-end" onClick={() => onClickApply()}>
          {buttonLabel}
        </Button>
      </Stack>
    </Card>
  );
};
export default BecomeModeratorCard;
