import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ImageCropper, { ImageCropperProps } from '.';

const meta: Meta<ImageCropperProps> = {
  title: 'Cropper/ImageCropper',
  component: ImageCropper,
};

export default meta;
type Story = StoryObj<ImageCropperProps>;

const avatar = {
  default: {
    height: 320,
    src: 'https://placebeard.it/320x320',
    width: 320,
  },
};

export const BaseImageCropper: Story = {
  render: () => (
    <ImageCropper
      image={avatar}
      dragToRepositionLabel="Drag the image to reposition"
      onCrop={() => ({})}
    />
  ),
};
