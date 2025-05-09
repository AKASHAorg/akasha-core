import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import {
  Caption,
  AlignCenter,
  AlignLeft,
  AlignRight,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { cn } from '@akashaorg/ui/lib/library/utils';

export type ImageBlockToolbar = {
  handleCaptionClick: () => void;
  handleLeftAlignClick: () => void;
  handleCenterAlignClick: () => void;
  handleRightAlignClick: () => void;
  handleEditClick: () => void;
  handleAddClick: () => void;
  showCaption: boolean;
  alignState: 'start' | 'center' | 'end';
};

/**
 * Component used in the image editor content block to align images, add captions
and add/edit images
 * @param alignState - flexbox alignment state
 */
const ImageBlockToolbar: React.FC<ImageBlockToolbar> = props => {
  const {
    handleCaptionClick,
    handleLeftAlignClick,
    handleCenterAlignClick,
    handleRightAlignClick,
    handleEditClick,
    handleAddClick,
    showCaption,
    alignState,
  } = props;

  const style = 'absolute stroke-secondaryLight dark:stroke-secondaryDark';
  const lgStyle = `h-6 w-6 ${style}`;
  const mdStyle = `h-5 w-5 ${style}`;

  return (
    <Stack direction="row" justifyContent="between">
      <Stack direction="row">
        <button onClick={handleCaptionClick}>
          <Stack
            alignItems="center"
            justifyContent="center"
            className={cn(
              'relative w-8 h-8 rounded-l-[0.125rem]',
              showCaption ? 'bg-secondaryLight/30 dark:bg-grey7' : 'bg-grey8 dark:bg-grey5',
            )}
          >
            <Caption className={lgStyle} />
          </Stack>
        </button>
        <button onClick={handleLeftAlignClick}>
          <Stack
            alignItems="center"
            justifyContent="center"
            className={cn(
              'relative w-8 h-8',
              alignState === 'start'
                ? 'bg-secondaryLight/30 dark:bg-grey7'
                : 'bg-grey8 dark:bg-grey5',
            )}
          >
            <AlignLeft className={lgStyle} />
          </Stack>
        </button>
        <button onClick={handleCenterAlignClick}>
          <Stack
            alignItems="center"
            justifyContent="center"
            className={cn(
              'relative w-8 h-8',
              alignState === 'center'
                ? 'bg-secondaryLight/30 dark:bg-grey7'
                : 'bg-grey8 dark:bg-grey5',
            )}
          >
            <AlignCenter className={lgStyle} />
          </Stack>
        </button>
        <button onClick={handleRightAlignClick}>
          <Stack
            alignItems="center"
            justifyContent="center"
            className={cn(
              'relative w-8 h-8 rounded-r-[0.125rem]',
              alignState === 'end'
                ? 'bg-secondaryLight/30 dark:bg-grey7'
                : 'bg-grey8 dark:bg-grey5',
            )}
          >
            <AlignRight className={lgStyle} />
          </Stack>
        </button>
      </Stack>
      <Stack direction="row" spacing={2}>
        <button onClick={handleEditClick}>
          <Stack
            alignItems="center"
            justifyContent="center"
            className={cn('h-8 w-8 group relative rounded-full bg-grey9 dark:bg-grey5')}
          >
            <PencilIcon className={mdStyle} />
          </Stack>
        </button>
        <button onClick={handleAddClick}>
          <Stack
            alignItems="center"
            justifyContent="center"
            className={cn('h-8 w-8 group relative rounded-full bg-grey9 dark:bg-grey5')}
          >
            <PlusIcon className={mdStyle} />
          </Stack>
        </button>
      </Stack>
    </Stack>
  );
};

export default ImageBlockToolbar;
