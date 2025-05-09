import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type BioProps = {
  title: string;
  biography: string;
};
const Bio: React.FC<BioProps> = ({ title, biography }) => {
  return (
    <Card className={'p-4'}>
      <Stack direction="column" spacing={2}>
        <Typography className="font-medium">{title}</Typography>
        <Typography variant="sm" className="break-all">
          {biography}
        </Typography>
      </Stack>
    </Card>
  );
};
export default Bio;
