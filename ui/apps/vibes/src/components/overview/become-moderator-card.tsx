import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type BecomeModeratorCardProps = {
  titleLabel: string;
  subtitleLabel: string;
  buttonLabel: string;
  onClickApply: () => void;
};
const BecomeModeratorCard: React.FC<BecomeModeratorCardProps> = props => {
  const { titleLabel, subtitleLabel, buttonLabel, onClickApply } = props;

  return (
    <Card padding={16}>
      <Stack spacing="gap-y-6">
        <Text variant="h5" weight="bold">
          {titleLabel}
        </Text>
        <Text variant="body2" weight="light" color={{ light: 'grey5', dark: 'grey6' }}>
          {subtitleLabel}
        </Text>
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
