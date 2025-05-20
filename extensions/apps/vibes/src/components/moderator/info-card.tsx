import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { TriangleAlertIcon } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type InfoCardProps = {
  titleLabel: string;
  subtitleLabel: string;
};
const InfoCard: React.FC<InfoCardProps> = props => {
  const { titleLabel, subtitleLabel } = props;
  return (
    <Card className="p-4 bg-destructive opacity-30">
      <Stack direction="row" alignItems="center" spacing={2}>
        <TriangleAlertIcon className="h-5 w-5 [&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
        <Typography variant="xs" bold>
          {titleLabel}
        </Typography>
      </Stack>
      <Typography variant="xs" className="font-medium font-light">
        {subtitleLabel}
      </Typography>
    </Card>
  );
};
export default InfoCard;
