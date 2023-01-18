import React from 'react';
import { IntegrationTypes } from '@akashaorg/typings/ui';

import AppAvatar from '.';

import { IAppAvatarProps } from '../../interfaces/appAvatar.interface';

export default {
  title: 'Avatars/AppAvatar',
  component: AppAvatar,
};

const ethAddress = '0x003410490050000320006570034567114572000';

const Template = (args: IAppAvatarProps) => <AppAvatar {...args} />;

export const BaseAvatar = Template.bind({});

BaseAvatar.args = {
  ethAddress: ethAddress,
  src: 'https://placebeard.it/360x360',
};

export const AvatarWithAppPlaceholder = Template.bind({});

AvatarWithAppPlaceholder.args = {
  appType: IntegrationTypes.APP,
};

export const AvatarWithWidgetPlaceholder = Template.bind({});

AvatarWithWidgetPlaceholder.args = {
  appType: IntegrationTypes.WIDGET,
};
