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
