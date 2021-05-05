import React from 'react';
import { Box, Grommet } from 'grommet';

import TextIcon, { ITextIconProps } from '.';

import { IconType } from '../Icon';

import lightTheme from '../../styles/themes/light/light-theme';

const iconTypeOptions: { Home: IconType; HotTopics: IconType; Media: IconType } = {
  Home: 'home',
  HotTopics: 'hotTopics',
  Media: 'media',
};

const fontSizes = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge',
  xxlarge: 'xxlarge',
};

const fontWeights = {
  normal: 'normal',
  bold: 'bold',
};

const iconSizes = {
  xsmall: 'xs',
  small: 'sm',
  medium: 'md',
  large: 'ld',
  xlarge: 'xl',
};

export default {
  title: 'TextIcons/TextIcon',
  component: TextIcon,
  argTypes: {
    color: { control: 'color' },
    backgroundColor: { control: 'color' },
    label: { control: 'text' },
    spacing: { control: 'text' },
    clickable: { control: 'boolean' },
    menuActive: { control: 'boolean' },
    menuIcon: { control: 'boolean' },
    accentColor: { control: 'boolean' },
    fadedText: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fontSize: {
      control: {
        type: 'select',
        options: fontSizes,
      },
    },
    fontWeight: {
      control: {
        type: 'select',
        options: fontWeights,
      },
    },
    iconSize: {
      control: {
        type: 'select',
        options: iconSizes,
      },
    },
    iconType: {
      control: {
        type: 'select',
        options: iconTypeOptions,
      },
    },
    onClick: { action: 'icon clicked' },
  },
};

const Template = (args: ITextIconProps) => (
  <Grommet theme={lightTheme}>
    <Box pad="large" align="center">
      <TextIcon {...args} />
    </Box>
  </Grommet>
);

export const BaseTextIcon = Template.bind({});

BaseTextIcon.args = {
  color: '#132540',
  label: 'Home',
  spacing: '10px',
  margin: { margin: '10px' },
  clickable: false,
  menuActive: false,
  menuIcon: false,
  accentColor: false,
  fadedText: false,
  disabled: false,
  fontSize: 'medium',
  fontWeight: 'normal',
  iconSize: 'md',
  iconType: 'home',
};
