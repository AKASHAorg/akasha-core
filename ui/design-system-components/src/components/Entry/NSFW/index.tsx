import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import React from 'react';

export type NSFWProps = {
  sensitiveContentLabel: string;
  clickToViewLabel: string;
  onClickToView: () => void;
};

const NSFW: React.FC<NSFWProps> = props => {
  const { sensitiveContentLabel, clickToViewLabel, onClickToView } = props;
  return (
    <Card padding={8} radius={10} elevation="2" background="white/80" customStyle="box-content">
      <Stack direction="row" spacing="gap-x-1">
        <Icon type="EyeSlashIcon" color="errorLight" />
        <Text variant="button-sm" color="errorLight">
          {sensitiveContentLabel}
        </Text>
      </Stack>
      <Button variant="text" label={clickToViewLabel} onClick={onClickToView} />
    </Card>
  );
};

export default NSFW;
