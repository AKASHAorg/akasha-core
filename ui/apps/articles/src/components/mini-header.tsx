import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ChevronLeftIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

export interface IMiniHeaderProps {
  titleLabel: string;
  onClickIcon: () => void;
}

const MiniHeader: React.FC<IMiniHeaderProps> = props => {
  const { titleLabel, onClickIcon } = props;

  return (
    <Card padding={8}>
      <Stack direction="row" fullWidth={true}>
        <button onClick={onClickIcon}>
          <Icon icon={<ChevronLeftIcon />} />
        </button>
        <Text variant="h2">{titleLabel}</Text>
      </Stack>
    </Card>
  );
};

export default MiniHeader;
