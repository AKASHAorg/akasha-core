import React from 'react';
import { Box, Grommet } from 'grommet';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';

import Icon, { IconProps, iconTypes } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { AppIcon, IAppIcon } from './app-icon';

export default {
  title: 'Icon/Icon',
  component: Icon,
  argTypes: {
    color: { control: 'color' },
    accentColor: { control: 'color' },
    backgroundColor: { control: 'color' },
    type: {
      control: {
        type: 'select',
        options: iconTypes,
      },
    },
    placeholderIconType: {
      control: {
        type: 'select',
        options: iconTypes,
      },
    },
  },
};

const Template = (args: IconProps) => (
  <Grommet theme={lightTheme}>
    <Box direction="row" align="center" gap="medium">
      <Icon {...args} type={args.type} size="sm" />
      <Icon {...args} type={args.type} size="md" />
      <Icon {...args} type={args.type} size="lg" />
    </Box>
  </Grommet>
);

const TemplateAppIcon = (args: IAppIcon) => (
  <Grommet theme={lightTheme}>
    <Box>
      <AppIcon {...args} />
    </Box>
  </Grommet>
);

const TemplateList = (args: {
  accentColor?: string;
  backgroundColor?: string;
  size: IconProps['size'];
}) => (
  <Grommet theme={lightTheme}>
    {iconTypes.map((type, idx) => (
      <Box direction="row" align="center" key={idx}>
        <div
          style={{
            backgroundColor: args.backgroundColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '40px',
            height: '40px',
            margin: '2px 0',
          }}
        >
          <Icon type={type} color={args.accentColor} size={args.size} />
        </div>
        <div>{type}</div>
      </Box>
    ))}
  </Grommet>
);

export const IconList = TemplateList.bind({});

IconList.args = {
  backgroundColor: '#EDF0F5',
  size: 'md',
};

export const IconSizes = Template.bind({});

IconSizes.args = {
  type: 'akasha',
};

export const BaseAppIcon = TemplateAppIcon.bind({});

BaseAppIcon.args = {
  placeholderIconType: 'akasha',
};

export const AppIconWithPlaceholder = TemplateAppIcon.bind({});

AppIconWithPlaceholder.args = {
  placeholderIconType: 'akasha',
  appImg: {
    type: LogoTypeSource.String,
    value: 'https://placebeard.it/400x400.png',
  },
};
