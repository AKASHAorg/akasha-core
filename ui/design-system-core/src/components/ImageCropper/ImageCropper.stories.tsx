import React from 'react';
import ImageCropper, { ImageCropperProps } from '.';

export default {
  title: 'Cropper/ImageCropper',
  component: ImageCropper,
};

const Template = (args: ImageCropperProps) => <ImageCropper {...args} />;

export const BaseImageCropper = Template.bind({});
BaseImageCropper.args = {
  image: {
    default: {
      height: 320,
      src: '',
      width: 320,
    },
  },
  dragToRepositionLabel: 'Drag the image to reposition',
};
