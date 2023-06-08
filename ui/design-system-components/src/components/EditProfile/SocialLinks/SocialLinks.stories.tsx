import React from 'react';
import { SocialLinks, SocialLinksProp } from '.';

export default {
  title: 'Profile/SocialLinks',
  component: SocialLinks,
};

const Template = (args: SocialLinksProp) => <SocialLinks {...args} />;

export const BaseSocialLinks = Template.bind({});
BaseSocialLinks.args = {
  title: 'External URLs',
  addNewButtonLabel: 'Add new',
  description: 'You can add your personal websites or social links to be shared on your profile',
  socialLinks: [],
  cancelButton: { label: 'Cancel', handleClick: () => ({}) },
  saveButton: {
    label: 'Save',
    handleClick: formValues => {
      console.log(formValues);
    },
  },
  onDelete: () => ({}),
};
