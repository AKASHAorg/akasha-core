import * as React from 'react';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { SecondarySidebarBox, SecondarySidebarContentWrapper } from './styled-sidebar';
import { Box, Text } from 'grommet';
import { IconLink } from '../../Buttons';
import { AppIcon } from '../../Icon/index';

export interface ISecondarySidebar {
  currentMenuItem?: IMenuItem;
  activeOption?: IMenuItem;
  onOptionClick: (menuItem: IMenuItem) => void;
}

const SecondarySidebar: React.FC<ISecondarySidebar> = props => {
  const { currentMenuItem, activeOption, onOptionClick } = props;
  return (
    <SecondarySidebarBox
      fill="vertical"
      direction="column"
      align="center"
      border={{
        color: 'border',
        size: 'xsmall',
        style: 'solid',
        side: 'right',
      }}
    >
      <SecondarySidebarContentWrapper>
        <Box
          pad={{ vertical: 'small', horizontal: 'none' }}
          fill="horizontal"
          border={{ color: 'border', size: '1px', side: 'bottom' }}
          gap="xsmall"
          direction="row"
          align="center"
        >
          <AppIcon placeholderIconType="app" size="md" appImg={currentMenuItem?.logo} />
          <Text size="large">{currentMenuItem?.label}</Text>
        </Box>
        <Box pad="none">
          {currentMenuItem?.subRoutes?.map((subRoute: IMenuItem, index: number) => (
            <Box pad={{ vertical: 'xsmall' }} key={index}>
              <IconLink
                label={subRoute.label}
                onClick={() => onOptionClick(subRoute)}
                active={subRoute.route === activeOption?.route}
              />
            </Box>
          ))}
        </Box>
      </SecondarySidebarContentWrapper>
    </SecondarySidebarBox>
  );
};

export { SecondarySidebar };
