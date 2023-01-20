import React from 'react';
import { Box, Grommet } from 'grommet';
import { LogoTypeSource } from '@akashaorg/typings/ui';
import Icon, { IconProps, iconTypes } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { AppIcon, IAppIcon } from './app-icon';
import { StyledIconBox } from '../AppInfoWidgetCard/styled-widget-cards';

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
  decorators: [],
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
        <StyledIconBox style={{ margin: '2px 0' }}>
          <Icon
            type={type}
            color={args.accentColor}
            size={args.size}
            wrapperStyle={{ width: '50%', height: 'inherit' }}
          />
        </StyledIconBox>
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

IconList.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/eI5afUtDh3y2Fg8SLYCR2X/%F0%9F%9F%A1-Updated-Design-System?node-id=24%3A866',
  },
};

export const IconSizes = Template.bind({});

IconSizes.args = {
  type: 'akasha',
};

IconSizes.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/eI5afUtDh3y2Fg8SLYCR2X/%F0%9F%9F%A1-Updated-Design-System?node-id=24%3A866',
  },
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
