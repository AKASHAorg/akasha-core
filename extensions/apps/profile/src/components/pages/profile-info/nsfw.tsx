import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import React from 'react';
import { EyeSlashIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

export type NSFWProps = {
  sensitiveContentLabel: string;
  descriptionFirstLine: string;
  descriptionSecondLine: string;
  clickToViewLabel: string;
  cancelLabel: string;
  onCancel: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  onClickToView: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
};

const NSFW: React.FC<NSFWProps> = props => {
  const {
    sensitiveContentLabel,
    clickToViewLabel,
    descriptionFirstLine,
    descriptionSecondLine,
    cancelLabel,
    onCancel,
    onClickToView,
  } = props;
  return (
    <Stack align="center" justify="center" spacing="gap-y-2">
      <Stack direction="row" spacing="gap-x-1">
        <Icon icon={<EyeSlashIcon />} color="errorLight" />
        <Text variant="h6" color="errorLight">
          {sensitiveContentLabel}
        </Text>
      </Stack>
      <Stack>
        <Text variant="body1" align="center">
          {descriptionFirstLine}
        </Text>
        <Text variant="body1" align="center">
          {descriptionSecondLine}
        </Text>
      </Stack>
      <Stack direction="row" spacing="gap-x-4">
        <Button variant="outline" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button onClick={onClickToView}>{clickToViewLabel}</Button>
      </Stack>
    </Stack>
  );
};

export default NSFW;
