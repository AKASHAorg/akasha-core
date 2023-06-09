import React from 'react';
import ListAppTopbar, { ListAppTopbarProps } from './';

export default {
  title: 'ListApp/ListAppTopbar',
  component: ListAppTopbar,
};

const Template = (args: ListAppTopbarProps) => {
  return (
    <div>
      <ListAppTopbar {...args} />
    </div>
  );
};

export const BaseListAppTopbar = Template.bind({});

BaseListAppTopbar.args = {
  handleIconMenuClick: () => ({}),
};
