import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import React from 'react';
import { EyeSlashIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

export type NSFWProps = {
  sensitiveContentLabel: string;
  clickToViewLabel: string;
  onClickToView: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
};

const NSFW: React.FC<NSFWProps> = props => {
  const { sensitiveContentLabel, clickToViewLabel, onClickToView } = props;
  return (
    <Stack align="center" justify="center">
      <Stack direction="row" spacing="gap-x-1">
        <Icon icon={<EyeSlashIcon />} color="errorLight" />
        <Text variant="button-sm" color="errorLight">
          {sensitiveContentLabel}
        </Text>
      </Stack>
      <Button variant="text" label={clickToViewLabel} onClick={onClickToView} />
    </Stack>
  );
};

export default NSFW;
