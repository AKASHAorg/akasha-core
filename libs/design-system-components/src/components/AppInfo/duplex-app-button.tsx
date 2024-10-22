import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { TrashIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export type DuplexAppButtonProps = {
  onUninstall: () => void;
};

export const DuplexAppButton: React.FC<DuplexAppButtonProps> = ({ onUninstall }) => {
  return (
    <Button plain onClick={onUninstall}>
      <Stack
        direction="row"
        align="center"
        justify="center"
        customStyle={'bg(grey8 dark:grey3) rounded-full w-8 h-8'}
      >
        <Icon
          icon={<TrashIcon />}
          size={{ width: 'w-4', height: 'h-5' }}
          color={{ light: 'errorLight', dark: 'errorDark' }}
        />
      </Stack>
    </Button>
  );
};
