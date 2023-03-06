import { apply, tw } from '@twind/core';
import React from 'react';
import Icon, { IconProps } from '.';

export default {
  title: 'Icons/Icon',
  component: Icon,
};

const AkashaIconsTemplate = (args: IconProps) => {
  const flagIconStyle = tw(apply`h-4`);

  return (
    <Icon
      type="FlagIcon"
      styling={flagIconStyle}
      color={{ light: 'error-light', dark: 'error-dark' }}
    />
  );
};

export const AkashaIcons = AkashaIconsTemplate.bind({});
AkashaIcons.args = {};

const Template = (args: IconProps) => <Icon {...args} />;

export const BaseIcon = Template.bind({});

BaseIcon.args = {
  type: 'akasha',
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

export const ExtraLargeIcon = Template.bind({});
ExtraLargeIcon.args = {
  type: 'akasha',
  size: 'xl',
};
