import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  AlignJustify,
  AlignCenter,
  AlignLeft,
  AlignRight,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import {
  PencilIcon,
  PlusIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

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
  return (
    <Stack direction="row" justify="between">
      <Stack direction="row">
        <button onClick={handleCaptionClick}>
          <Stack
            align="center"
            justify="center"
            customStyle="relative w-6 h-6 rounded-l-sm"
            background={
              showCaption
                ? { light: 'secondaryLight/30', dark: 'grey7' }
                : { light: 'grey8', dark: 'grey5' }
            }
          >
            <Icon icon={<AlignJustify />} customStyle="absolute" />
          </Stack>
        </button>
        <button onClick={handleLeftAlignClick}>
          <Stack
            align="center"
            justify="center"
            customStyle="relative w-6 h-6"
            background={
              alignState === 'start'
                ? { light: 'secondaryLight/30', dark: 'grey7' }
                : { light: 'grey8', dark: 'grey5' }
            }
          >
            <Icon icon={<AlignLeft />} customStyle="absolute" />
          </Stack>
        </button>
        <button onClick={handleCenterAlignClick}>
          <Stack
            align="center"
            justify="center"
            customStyle="relative w-6 h-6"
            background={
              alignState === 'center'
                ? { light: 'secondaryLight/30', dark: 'grey7' }
                : { light: 'grey8', dark: 'grey5' }
            }
          >
            <Icon icon={<AlignCenter />} customStyle="absolute" />
          </Stack>
        </button>
        <button onClick={handleRightAlignClick}>
          <Stack
            align="center"
            justify="center"
            customStyle="relative w-6 h-6 rounded-r-sm"
            background={
              alignState === 'end'
                ? { light: 'secondaryLight/30', dark: 'grey7' }
                : { light: 'grey8', dark: 'grey5' }
            }
          >
            <Icon icon={<AlignRight />} customStyle="absolute" />
          </Stack>
        </button>
      </Stack>
      <Stack direction="row" spacing="gap-2">
        <button onClick={handleEditClick}>
          <Stack
            align="center"
            justify="center"
            customStyle={'h-6 w-6 group relative rounded-full bg(grey9 dark:grey5)'}
          >
            <Icon size="xs" icon={<PencilIcon />} accentColor />
          </Stack>
        </button>
        <button onClick={handleAddClick}>
          <Stack
            align="center"
            justify="center"
            customStyle={'h-6 w-6 group relative rounded-full bg(grey9 dark:grey5)'}
          >
            <Icon size="xs" icon={<PlusIcon />} accentColor />
          </Stack>
        </button>
      </Stack>
    </Stack>
  );
};

export default ImageBlockToolbar;
