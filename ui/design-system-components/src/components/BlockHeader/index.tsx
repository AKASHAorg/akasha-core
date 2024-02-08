import * as React from 'react';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { TrashIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import BlockStatusToolbar, { IBlockStatusToolbar } from '../BlockStatusToolbar';

export interface BlockHeaderProps extends IBlockStatusToolbar {
  icon?: JSX.Element;
  handleRemoveBlock?: () => void;
  handleNsfwChange?: () => void;
  isNsfwCheckboxSelected?: boolean;
}

export const BlockHeader: React.FC<BlockHeaderProps> = props => {
  const { icon, handleRemoveBlock, handleNsfwChange, isNsfwCheckboxSelected, ...rest } = props;
  return (
    <Stack direction="row" justify="between">
      <Stack
        align="center"
        justify="center"
        customStyle={'h-8 w-8 group relative rounded-full bg(secondaryLight/30 dark:secondaryDark)'}
      >
        <Icon size="sm" icon={icon} />
      </Stack>
      <Checkbox
        id="nsfw"
        label={'NSFW'}
        name="nsfw"
        value="nsfw"
        handleChange={handleNsfwChange}
        isSelected={isNsfwCheckboxSelected}
      />
      <BlockStatusToolbar {...rest} />
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
