import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { TrashIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

export type BlockHeaderProps = {
  icon?: JSX.Element;
  handleRemoveBlock?: () => void;
};

export const BlockHeader: React.FC<BlockHeaderProps> = props => {
  const { icon, handleRemoveBlock } = props;
  return (
    <Stack direction="row" justify="between">
      <Stack
        align="center"
        justify="center"
        customStyle={'h-8 w-8 group relative rounded-full bg(secondaryLight/30 dark:secondaryDark)'}
      >
        <Icon size="sm" icon={icon} />
      </Stack>
      <button onClick={handleRemoveBlock}>
        <Stack
          align="center"
          justify="center"
          customStyle={'h-8 w-8 group relative rounded-full bg(grey9 dark:grey5)'}
        >
          <Icon icon={<TrashIcon />} size="sm" color={{ light: 'errorLight', dark: 'errorDark' }} />
        </Stack>
      </button>
    </Stack>
  );
};
