import React from 'react';
import AppIcon, { IAppIcon } from '.';

export default {
  title: 'Icons/AppIcon',
  component: AppIcon,
};

const Template = (args: IAppIcon) => <AppIcon {...args} />;

export const BaseIcon = Template.bind({});

BaseIcon.args = {
  placeholderIconType: 'notifications',
  plain: true,
  stackedIcon: true,
  hasNewNotifs: true,
};

export const SmallIcon = Template.bind({});
SmallIcon.args = {
  placeholderIconType: 'notifications',
  plain: true,
  stackedIcon: true,
  hasNewNotifs: true,
  size: 'sm',
};

export const MediumIcon = Template.bind({});
MediumIcon.args = {
  placeholderIconType: 'notifications',
  plain: true,
  stackedIcon: true,
  hasNewNotifs: true,
  size: 'md',
};

export const LargeIcon = Template.bind({});
LargeIcon.args = {
  placeholderIconType: 'notifications',
  plain: true,
  stackedIcon: true,
  hasNewNotifs: true,
  size: 'lg',
};

export const ExtraLargeIcon = Template.bind({});
ExtraLargeIcon.args = {
  placeholderIconType: 'notifications',
  plain: true,
  stackedIcon: true,
  hasNewNotifs: true,
  size: 'xl',
};
