import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import React from 'react';
import { EyeSlashIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';

export type NSFWProps = {
  sensitiveContentLabel: string;
  clickToViewLabel: string;
  onClickToView: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
};

const NSFW: React.FC<NSFWProps> = props => {
  const { sensitiveContentLabel, clickToViewLabel, onClickToView } = props;
  return (
    <Card className="w-full p-4 flex place-content-center bg-muted">
      <Card className={'max-w-min'}>
        <Stack direction={'row'} alignItems="center" spacing={2}>
          <Icon icon={<EyeSlashIcon />} color={{ light: 'errorLight', dark: 'errorDark' }} />
          <Text
            variant="button-sm"
            color={{ light: 'errorLight', dark: 'errorDark' }}
            customStyle="whitespace-nowrap"
          >
            {sensitiveContentLabel}
          </Text>
        </Stack>
        <Button variant="link" onClick={onClickToView}>
          {clickToViewLabel}
        </Button>
      </Card>
    </Card>
  );
};

export default NSFW;
