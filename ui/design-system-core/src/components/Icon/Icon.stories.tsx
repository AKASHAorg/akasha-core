import { apply, tw } from '@twind/core';
import React from 'react';
import Icon, { IconProps } from '.';
import { CustomIconTypes } from './akasha-icons';

export default {
  title: 'Icons/Icon',
  component: Icon,
};

const CustomIconsTemplate = (args: IconProps) => {
  const customIcons: CustomIconTypes[] = [
    'akasha',
    'discord',
    'github',
    'telegram',
    'twitter',
    'widget',
  ];

  return (
    <>
      {customIcons.map(icon => (
        <Icon key={icon} type={icon} {...args} />
      ))}
    </>
  );
};

export const CustomIcons = CustomIconsTemplate.bind({});
CustomIcons.args = {};

const Template = (args: IconProps) => <Icon {...args} />;

export const BaseIcon = Template.bind({});

BaseIcon.args = {
  type: 'akasha',
};

export const ExtraSmallIcon = Template.bind({});
ExtraSmallIcon.args = {
  type: 'akasha',
  size: 'xs',
};

export const SmallIcon = Template.bind({});
SmallIcon.args = {
  type: 'akasha',
  size: 'sm',
};

export const LargeIcon = Template.bind({});
LargeIcon.args = {
  type: 'akasha',
  size: 'lg',
};
