import React from 'react';
import Icon, { IconProps } from '.';

export default {
  title: 'Icons/Icon',
  component: Icon,
};

const Template = (args: IconProps) => <Icon {...args} />;

export const BaseIcon = Template.bind({});

BaseIcon.args = {
  type: 'akasha',
  plain: true,
};

export const ExtraSmallIcon = Template.bind({});
ExtraSmallIcon.args = {
  type: 'akasha',
  plain: true,
  size: 'xs',
};

export const SmallIcon = Template.bind({});
SmallIcon.args = {
  type: 'akasha',
  plain: true,
  size: 'sm',
};

export const LargeIcon = Template.bind({});
LargeIcon.args = {
  type: 'akasha',
  plain: true,
  size: 'lg',
};
