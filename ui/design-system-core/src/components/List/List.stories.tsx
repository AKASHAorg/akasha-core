import React from 'react';
import List, { ListProps } from './index';

export default {
  title: 'List/List',
  component: List,
};

const Template = (args: ListProps) => <List {...args} />;

export const BaseList = Template.bind({});
BaseList.args = {
  items: [
    { label: 'Upload', icon: 'ArrowUpOnSquareIcon', onClick: () => ({}) },
    { label: 'Edit', icon: 'PencilIcon', onClick: () => ({}) },
    {
      label: 'Delete',
      icon: 'TrashIcon',
      color: { light: 'errorLight', dark: 'errorDark' },
      onClick: () => ({}),
    },
  ],
};
