import React from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IBecomeModeratorCardProps {
  titleLabel: string;
  subtitleLabel: string;
  buttonLabel: string;
  onClickApply: () => void;
}
const BecomeModeratorCard: React.FC<IBecomeModeratorCardProps> = props => {
  const { titleLabel, subtitleLabel, buttonLabel, onClickApply } = props;

  return (
    <BasicCardBox pad="p-4">
      <Box customStyle="flex flex-col items-center space-y-6">
        <Text variant="h6" weight="bold">
          {titleLabel}
        </Text>

        <Text variant="body2" color={{ light: 'grey5', dark: 'grey6' }}>
          {subtitleLabel}
        </Text>

        <Button size="md" variant="primary" label={buttonLabel} onClick={onClickApply} />
      </Box>
    </BasicCardBox>
  );
};

export default BecomeModeratorCard;
