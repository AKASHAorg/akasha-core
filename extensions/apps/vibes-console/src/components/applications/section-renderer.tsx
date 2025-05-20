import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type SectionHeaderProps = {
  titleLabel: string;
  buttonLabel: string;
  noItemLabel: string;
  onButtonClick: () => void;
};
export const SectionRenderer: React.FC<SectionHeaderProps> = props => {
  const { titleLabel } = props;
  return (
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="between">
        <Typography variant="h5">{titleLabel}</Typography>
      </Stack>
    </Stack>
  );
};
