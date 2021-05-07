import React from 'react';
import { Box, Grommet } from 'grommet';

import AppMenuPopover, { IAppMenuPopover } from '.';

import Icon from '../Icon';

import lightTheme from '../../styles/themes/light/light-theme';
import { installedAppsData } from '../../utils/dummy-data';

export default {
  title: 'Popovers/AppMenuPopover',
  component: AppMenuPopover,
  argTypes: {
    onClickMenuItem: { action: 'clicked item' },
  },
};

const Template = (args: IAppMenuPopover) => {
  const iconRef: React.Ref<any> = React.useRef();
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <Grommet theme={lightTheme}>
      <Box fill={true} justify="center" align="center">
        <Box width="medium" pad={{ top: 'large' }}>
          <div ref={iconRef}>
            <Icon type="eye" onClick={() => setMenuOpen(true)} />
          </div>
          {iconRef.current && menuOpen && (
            <AppMenuPopover
              {...args}
              target={iconRef.current}
              closePopover={() => setMenuOpen(false)}
            />
          )}
        </Box>
      </Box>
    </Grommet>
  );
};

export const BaseAppMenuPopover = Template.bind({});

BaseAppMenuPopover.args = {
  menuItem: {
    ...installedAppsData[0],
    subRoutes: [installedAppsData[1], installedAppsData[2], installedAppsData[3]],
  },
};
