import React from 'react';
import ActionDropdown, { ActionDropdownProps } from './index';

export default {
  title: 'Buttons/ActionDropdown',
  component: ActionDropdown,
};

const Template = (args: ActionDropdownProps) => <ActionDropdown {...args} />;

export const BaseDialog = Template.bind({});
BaseDialog.args = {
  actions: [
    { label: 'Upload', icon: 'ArrowUpOnSquareIcon', onClick: () => ({}) },
    { label: 'Edit', icon: 'PencilIcon', onClick: () => ({}) },
    {
      label: 'Delete',
      icon: 'TrashIcon',
      color: { light: 'error-light', dark: 'error-dark' },
      onClick: () => ({}),
    },
  ],
};
