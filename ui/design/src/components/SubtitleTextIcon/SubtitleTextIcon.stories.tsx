import React from 'react';
import { Box, Grommet } from 'grommet';

import SubtitleTextIcon, { ISubtitleTextIcon } from '.';

import { IconType } from '../Icon';

import lightTheme from '../../styles/themes/light/light-theme';

const iconTypeOptions: { Home: IconType; HotTopics: IconType; Media: IconType } = {
  Home: 'home',
  HotTopics: 'hotTopics',
  Media: 'media',
};

const labelSizes = {
  Small: 'small',
  Large: 'large',
};

export default {
  title: 'TextIcons/SubtitleTextIcon',
  component: SubtitleTextIcon,
  argTypes: {
    labelColor: { control: 'color' },
    subtitleColor: { control: 'color' },
    label: { control: 'text' },
    subtitle: { control: 'text' },
    labelSize: {
      control: {
        type: 'select',
        options: labelSizes,
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

const Template = (args: ISubtitleTextIcon) => (
  <Grommet theme={lightTheme}>
    <Box pad="large" align="center">
      <SubtitleTextIcon {...args} />
    </Box>
  </Grommet>
);

export const BaseSubtitleTextIcon = Template.bind({});

BaseSubtitleTextIcon.args = {
  labelColor: '#132540',
  subtitleColor: '#132540',
  label: 'Text',
  subtitle: 'Some text',
  labelSize: 'small',
  iconType: 'home',
};
