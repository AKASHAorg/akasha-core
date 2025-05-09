import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
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
      <Stack spacing="gap-y-6">
        <Typography variant="h5" bold>
          {titleLabel}
        </Typography>
        <Typography variant="sm" className="font-light text-grey5 dark:text-grey6">
          {subtitleLabel}
        </Typography>
        <Button
          variant="primary"
          label={buttonLabel}
          customStyle="w-fit self-end"
          onClick={() => onClickApply()}
        />
      </Stack>
    </Card>
  );
};
export default BecomeModeratorCard;
