import React from 'react';
import Dropdown from '.';

export default {
  title: 'Buttons/Dropdown',
  component: Dropdown,
};

const Template = args => <Dropdown {...args} />;

export const BaseDropdown = Template.bind({});
BaseDropdown.args = {
  name: 'form1',
  menuItems: [
    {
      id: '1',
      item: { iconName: 'BeakerIcon', title: 'Option 1' },
    },
    {
      id: '2',
      item: { iconName: 'ArchiveBoxIcon', title: 'Option 2' },
    },
  ],
};

export const DropdownWithLabel = Template.bind({});
DropdownWithLabel.args = {
  label: 'Select One',
  menuItems: [
    {
      id: '1',
      item: { iconName: 'BeakerIcon', title: 'Option 1' },
    },
    {
      id: '2',
      item: { iconName: 'ArchiveBoxIcon', title: 'Option 2' },
    },
  ],
};
