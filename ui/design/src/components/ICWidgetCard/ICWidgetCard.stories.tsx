import React from 'react';
import { Box, Grommet } from 'grommet';
import { withDesign } from 'storybook-addon-designs';
import ICWidgetCard, { ICWidgetCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { ICInstalledAppsData, ICWorldAppsData } from '../../utils/dummy-data';

export default {
  title: 'Cards/ICWidgetCard',
  component: ICWidgetCard,
  argType: {
    onClickWorldApp: { action: 'clicked world app' },
    onClickInstalledApp: { action: 'clicked installed app' },
    onActiveTabChange: { action: 'active tab changed' },
  },
  decorators: [withDesign],
};

const Template = (args: ICWidgetCardProps) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <ICWidgetCard {...args} />
    </Box>
  </Grommet>
);

export const BaseICWidgetCard = Template.bind({});

BaseICWidgetCard.args = {
  titleLabel: 'My Apps',
  worldAppsLabel: 'World Apps',
  installedAppsLabel: 'Installed',
  worldApps: ICWorldAppsData,
  installedApps: ICInstalledAppsData,
  isLoadingWorldApps: true,
  isLoadingInstalledApps: true,
  noWorldAppsLabel: 'No World Apps. Please check later',
  noInstalledAppsLabel: 'No Installed Apps. Please install an app',
};

BaseICWidgetCard.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/eI5afUtDh3y2Fg8SLYCR2X/%F0%9F%9F%A1-Updated-Design-System?node-id=46%3A2160',
  },
};
