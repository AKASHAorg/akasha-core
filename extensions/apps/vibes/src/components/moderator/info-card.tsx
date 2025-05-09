import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { TriangleAlertIcon } from 'lucide-react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type InfoCardProps = {
  titleLabel: string;
  subtitleLabel: string;
};

const InfoCard: React.FC<InfoCardProps> = props => {
  const { titleLabel, subtitleLabel } = props;

  return (
    <Card className="p-4 bg-destructive opacity-30">
      <Stack direction="row" align="center" spacing="gap-x-2">
        <TriangleAlertIcon className="h-5 w-5 [&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
        <Text variant="button-sm" weight="bold">
          {titleLabel}
        </Text>
      </Stack>
      <Text variant="footnotes2" weight="light">
        {subtitleLabel}
      </Text>
    </Card>
  );
};

export default InfoCard;
