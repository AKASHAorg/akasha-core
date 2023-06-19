import React from 'react';
import AppIcon, { AppIconProps } from '.';

export default {
  title: 'Icons/AppIcon',
  component: AppIcon,
};

const Template = (args: AppIconProps) => <AppIcon {...args} />;

export const BaseIcon = Template.bind({});

BaseIcon.args = {
  placeholderIconType: 'notifications',
  stackedIcon: true,
  hasNewNotifs: true,
};

export const ExtraSmallIcon = Template.bind({});
ExtraSmallIcon.args = {
  placeholderIconType: 'notifications',
  stackedIcon: true,
  hasNewNotifs: true,
  size: 'xs',
};

export const SmallIcon = Template.bind({});
SmallIcon.args = {
  placeholderIconType: 'notifications',
  stackedIcon: true,
  hasNewNotifs: true,
  size: 'sm',
};

export const LargeIcon = Template.bind({});
LargeIcon.args = {
  placeholderIconType: 'notifications',
  stackedIcon: true,
  hasNewNotifs: true,
  size: 'lg',
};

export const CustomColoredIcon = Template.bind({});
CustomColoredIcon.args = {
  placeholderIconType: 'CheckIcon',
  stackedIcon: true,
  size: 'xs',
  iconColor: 'white',
  background: 'secondaryDark',
  onClick: () => ({}),
};
