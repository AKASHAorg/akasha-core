import type { Meta, StoryObj } from '@storybook/react';

import ImageCropper, {
  ImageCropperProps,
} from '@akashaorg/design-system-core/lib/components/ImageCropper';

const meta: Meta<ImageCropperProps> = {
  title: 'DSCore/Cropper/ImageCropper',
  component: ImageCropper,

  argTypes: {
    image: { control: 'object' },
    dragToRepositionLabel: { control: 'text' },
    onCrop: { action: 'image cropped' },
  },
};

type Story = StoryObj<ImageCropperProps>;

export const Default: Story = {
  args: {
    image: {
      height: 320,
      src: 'https://placebeard.it/320x320',
      width: 320,
    },
    dragToRepositionLabel: 'Drag the image to reposition',
  },
};

export default meta;
