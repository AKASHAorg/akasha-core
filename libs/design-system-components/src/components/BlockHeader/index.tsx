import * as React from 'react';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  TrashIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import BlockStatusToolbar, { IBlockStatusToolbar } from '../BlockStatusToolbar';

export interface BlockHeaderProps extends IBlockStatusToolbar {
  icon?: JSX.Element;
  blockOrder?: number;
  totalBlocksLength?: number;
  handleIncreaseBlockOrder?: (index: number) => void;
  handleDecreaseBlockOrder?: (index: number) => void;
  handleRemoveBlock?: (index: number) => void;
  handleNsfwChange?: () => void;
  isNsfwCheckboxSelected?: boolean;
  isFocusedBlock?: boolean;
}

/**
 * Component used to display the generic block actions for a content block in the beam editor
 * @param icon - icon passed down from the content block, specific for each type
 * @param blockOrder - index of the block in the list of used blocks
 * @param totalBlocksLength - length of the list of used blocks
 * @param handleIncreaseBlockOrder - handler to increment the index of the block by 1
 * @param handleDecreaseBlockOrder - handler to decrement the index of the block by 1
 * @param handleRemoveBlock - handler to remove the block from the list of used blocks
 * @param handleNsfwChange - handler to toggle the nsfw status of the block
 * @param isNsfwCheckboxSelected - pass the nsfw status of the block
 * @param isFocusedBlock - depends on the focused status of the block, renders certain elements only
 * for a focused block
 */
export const BlockHeader: React.FC<BlockHeaderProps> = props => {
  const {
    icon,
    blockOrder,
    totalBlocksLength,
    handleIncreaseBlockOrder,
    handleDecreaseBlockOrder,
    handleRemoveBlock,
    handleNsfwChange,
    isNsfwCheckboxSelected,
    isFocusedBlock,
    ...rest
  } = props;

  const increaseBlockOrder = () => {
    handleIncreaseBlockOrder(blockOrder);
  };

  const decreaseBlockOrder = () => {
    handleDecreaseBlockOrder(blockOrder);
  };

  const removeBlock = () => {
    handleRemoveBlock(blockOrder);
  };

  return (
    <Stack direction="row" justify="between">
      <Stack direction="row" spacing="gap-x-1" align="center">
        <Stack
          align="center"
          justify="center"
          customStyle={
            'h-8 w-8 group relative rounded-full bg(secondaryLight/30 dark:secondaryDark)'
          }
        >
          <Icon size="sm" icon={icon} />
        </Stack>
        {isFocusedBlock && (
          <Checkbox
            id="nsfw"
            label={'NSFW'}
            name="nsfw"
            value="nsfw"
            handleChange={handleNsfwChange}
            isSelected={isNsfwCheckboxSelected}
          />
        )}
      </Stack>
      <BlockStatusToolbar {...rest} />
      {isFocusedBlock && (
        <Stack direction="row" spacing="gap-x-1" align="center">
          {totalBlocksLength > 0 && (
            <button onClick={decreaseBlockOrder}>
              <Stack
                align="center"
                justify="center"
                customStyle={'h-8 w-8 group relative rounded-full bg(grey9 dark:grey5)'}
              >
                <Icon icon={<ArrowUpIcon />} size="sm" accentColor disabled={blockOrder === 0} />
              </Stack>
            </button>
          )}
          {totalBlocksLength > 0 && (
            <button onClick={increaseBlockOrder}>
              <Stack
                align="center"
                justify="center"
                customStyle={'h-8 w-8 group relative rounded-full bg(grey9 dark:grey5)'}
              >
                <Icon
                  icon={<ArrowDownIcon />}
                  size="sm"
                  accentColor
                  disabled={blockOrder > totalBlocksLength - 2}
                />
              </Stack>
            </button>
          )}
          <button onClick={removeBlock}>
            <Stack
              align="center"
              justify="center"
              customStyle={'h-8 w-8 group relative rounded-full bg(grey9 dark:grey5)'}
            >
              <Icon
                icon={<TrashIcon />}
                size="sm"
                color={{ light: 'errorLight', dark: 'errorDark' }}
              />
            </Stack>
          </button>
        </Stack>
      )}
    </Stack>
  );
};
