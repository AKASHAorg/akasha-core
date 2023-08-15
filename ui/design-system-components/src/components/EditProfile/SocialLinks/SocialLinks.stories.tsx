import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { SocialLinks, SocialLinksProps } from '.';

const meta: Meta<SocialLinksProps> = {
  title: 'Profile/SocialLinks',
  component: SocialLinks,
};

export default meta;
type Story = StoryObj<SocialLinksProps>;

export const BaseSocialLinks: Story = {
  render: () => (
    <SocialLinks
      title="External URLs"
      addNewButtonLabel="Add new"
      description="You can add your personal websites or social links to be shared on your profile"
      socialLinks={[]}
      cancelButton={{ label: 'Cancel', handleClick: () => ({}) }}
      saveButton={{
        label: 'Save',
        handleClick: formValues => {
          console.log(formValues);
        },
      }}
      onDelete={() => ({})}
    />
  ),
};
