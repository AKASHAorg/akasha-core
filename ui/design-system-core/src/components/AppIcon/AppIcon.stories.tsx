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
