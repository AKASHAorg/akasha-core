import React from 'react';
import { Box, Grommet } from 'grommet';

import ImagePopover, { IImagePopover } from '.';
import { FormImagePopover, IFormImagePopover } from './form-image-popover';

import Icon from '../Icon';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Popovers/ImagePopover',
  component: ImagePopover,
  argTypes: {
    dropzoneLabel: { control: 'text' },
    uploadImageLabel: { control: 'text' },
    uploadingImageLabel: { control: 'text' },
    byUrlLabel: { control: 'text' },
    insertLabel: { control: 'text' },
    uploadFailedLabel: { control: 'text' },
    fetchImageFailedLabel: { control: 'text' },
    uploadLabel: { control: 'text' },
    deleteLabel: { control: 'text' },
    currentImage: { control: 'boolean' },
    onMobile: { control: 'boolean' },
    uploadRequest: { action: 'upload image' },
    insertImage: { action: 'insert image' },
    handleDeleteImage: { action: 'insert image' },
  },
};

const Template = (args: IImagePopover) => {
  const iconRef: React.Ref<any> = React.useRef();
  const [selectOpen, setSelectOpen] = React.useState(false);
  return (
    <Grommet theme={lightTheme}>
      <Box fill={true} justify="center" align="center">
        <Box width="medium" pad={{ top: 'large' }}>
          <div ref={iconRef}>
            <Icon type="eye" onClick={() => setSelectOpen(true)} />
          </div>
          {iconRef.current && selectOpen && (
            <ImagePopover
              {...args}
              target={iconRef.current}
              closePopover={() => setSelectOpen(false)}
            />
          )}
        </Box>
      </Box>
    </Grommet>
  );
};

const TemplateForm = (args: IFormImagePopover) => {
  const iconRef: React.Ref<any> = React.useRef();
  const [selectOpen, setSelectOpen] = React.useState(false);
  return (
    <Grommet theme={lightTheme}>
      <Box fill={true} justify="center" align="center">
        <Box width="medium" pad={{ top: 'large' }}>
          <div ref={iconRef}>
            <Icon type="eye" onClick={() => setSelectOpen(true)} />
          </div>
          {iconRef.current && selectOpen && (
            <FormImagePopover
              {...args}
              target={iconRef.current}
              closePopover={() => setSelectOpen(false)}
            />
          )}
        </Box>
      </Box>
    </Grommet>
  );
};

export const BaseImagePopover = Template.bind({});

BaseImagePopover.args = {
  dropzoneLabel: 'Drop an image or click to upload an image from your computer',
  uploadImageLabel: 'Upload Image',
  uploadingImageLabel: 'Uploading image',
  byUrlLabel: 'By Url',
  insertLabel: 'Insert',
  uploadFailedLabel: 'Upload failed',
  fetchImageFailedLabel: 'Fetch image failed',
};

export const BaseFormImagePopover = TemplateForm.bind({});

BaseFormImagePopover.args = {
  uploadLabel: 'Upload Image',
  deleteLabel: 'Delete',
  onMobile: false,
};

export const FormImagePopoverWithCurrentImage = TemplateForm.bind({});

FormImagePopoverWithCurrentImage.args = {
  uploadLabel: 'Upload Image',
  deleteLabel: 'Delete',
  currentImage: true,
  onMobile: false,
};
