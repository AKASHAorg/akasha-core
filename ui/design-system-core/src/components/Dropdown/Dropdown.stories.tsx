import React from 'react';
import Dropdown, { DropdownMenuItemType } from '.';

export default {
  title: 'Buttons/Dropdown',
  component: Dropdown,
};

const Template = args => {
  const [selected, setSelected] = React.useState<DropdownMenuItemType | null>();

  return <Dropdown {...args} selected={selected} setSelected={setSelected} />;
};

export const BaseDropdown = Template.bind({});
BaseDropdown.args = {
  name: 'BaseDropdown',
  menuItems: [
    { id: '1', iconName: 'BeakerIcon', title: 'Option 1' },
    { id: '2', iconName: 'ArchiveBoxIcon', title: 'Option 2' },
    { id: '3', iconName: 'ArchiveBoxIcon', title: 'Option 3' },
  ],
};

export const DropdownOptionsWithoutIcon = Template.bind({});
DropdownOptionsWithoutIcon.args = {
  name: 'DropdownOptionsWithoutIcon',
  menuItems: [
    { id: '1', title: 'Option 1' },
    { id: '2', title: 'Option 2' },
  ],
};

export const DropdownWithLabel = Template.bind({});
DropdownWithLabel.args = {
  label: 'Select One',
  menuItems: [
    { id: '1', iconName: 'BeakerIcon', title: 'Option 1' },
    { id: '2', iconName: 'ArchiveBoxIcon', title: 'Option 2' },
  ],
};

export const DropdownWithPlaceholderLabel = Template.bind({});
DropdownWithPlaceholderLabel.args = {
  name: 'DropdownWithPlaceholderLabel',
  placeholderLabel: 'Select an option',
  menuItems: [
    { id: '1', iconName: 'BeakerIcon', title: 'Option 1' },
    { id: '2', iconName: 'ArchiveBoxIcon', title: 'Option 2' },
  ],
};
