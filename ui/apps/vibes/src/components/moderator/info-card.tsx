import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ExclamationTriangleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type InfoCardProps = {
  titleLabel: string;
  subtitleLabel: string;
};

const InfoCard: React.FC<InfoCardProps> = props => {
  const { titleLabel, subtitleLabel } = props;

  return (
    <Card elevation="none" padding={16} customStyle="bg(errorLight/30 dark:errorDark/30)">
      <Stack direction="row" align="center" spacing="gap-x-2">
        <Icon
          icon={<ExclamationTriangleIcon />}
          color={{ light: 'errorLight', dark: 'errorDark' }}
        />
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
