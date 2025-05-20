import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type JoinVibesCardProps = {
  title: string;
  description: string;
  ctaButtonLabel: string;
  onCtaButtonClick: () => void;
};
export const JoinVibesCard: React.FC<JoinVibesCardProps> = props => {
  const { title, description, ctaButtonLabel, onCtaButtonClick } = props;
  return (
    <Card className="shadow-none">
      <Stack spacing={2}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="sm" className="text-grey4 dark:text-grey6">
          {description}!🛡️
        </Typography>

        <Button size="sm" onClick={onCtaButtonClick} className="w-fit self-end">
          {ctaButtonLabel}
        </Button>
      </Stack>
    </Card>
  );
};
