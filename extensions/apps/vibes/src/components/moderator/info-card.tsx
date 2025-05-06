import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ExclamationTriangleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type InfoCardProps = {
  titleLabel: string;
  subtitleLabel: string;
};
const InfoCard: React.FC<InfoCardProps> = props => {
  const { titleLabel, subtitleLabel } = props;
  return (
    <Card className="p-4 bg-destructive opacity-30">
      <Stack direction="row" align="center" spacing="gap-x-2">
        <Icon
          icon={<ExclamationTriangleIcon />}
          customStyle="[&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark"
        />
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
