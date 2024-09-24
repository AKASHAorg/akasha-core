import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import React from 'react';
import { EyeSlashIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Card from '@akashaorg/design-system-core/lib/components/Card';

export type NSFWProps = {
  sensitiveContentLabel: string;
  clickToViewLabel: string;
  onClickToView: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
};

const NSFW: React.FC<NSFWProps> = props => {
  const { sensitiveContentLabel, clickToViewLabel, onClickToView } = props;
  return (
    <Card
      elevation="none"
      fullWidth={true}
      background={{ light: 'grey9', dark: 'grey5' }}
      customStyle={'items-center'}
      padding="p-4"
    >
      <Card customStyle={'max-w-min'} elevation={'2'} padding="p-2" radius={10}>
        <Stack direction={'row'} align="center" spacing="gap-x-2">
          <Icon icon={<EyeSlashIcon />} color="errorLight" />
          <Text variant="button-sm" color="errorLight" customStyle="whitespace-nowrap">
            {sensitiveContentLabel}
          </Text>
        </Stack>
        <Button variant="text" label={clickToViewLabel} onClick={onClickToView} />
      </Card>
    </Card>
  );
};

export default NSFW;
