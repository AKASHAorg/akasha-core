import React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';

import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';

export interface IMenuSubItemsProps {
  isMobile: boolean;
  menuItem: IMenuItem;
  activeOption: IMenuItem | null;
  onOptionClick: (menu: IMenuItem, submenu: IMenuItem) => void;
}

// isMobile prop is used to determine the display status
const StyledWrapper = styled(Box)<{ isMobile: boolean }>`
  display: ${props => (props.isMobile ? 'none' : 'initial')};
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    display: ${props => (props.isMobile ? 'initial' : 'none')};
  }
`;

const MenuSubItems: React.FC<IMenuSubItemsProps> = props => {
  const { isMobile, menuItem, activeOption, onOptionClick } = props;

  return (
    <StyledWrapper pad={{ horizontal: 'medium' }} isMobile={isMobile}>
      <Box direction="column" justify="evenly" margin={{ left: 'medium' }}>
        {menuItem.subRoutes.map((subRouteMenuItem, idx) => (
          <Box
            key={idx + subRouteMenuItem.label}
            pad={{ vertical: 'large', left: 'large' }}
            border={{
              size: 'medium',
              color: subRouteMenuItem.route === activeOption?.route ? 'accent' : 'border',
              side: 'left',
            }}
            onClick={() => onOptionClick(menuItem, subRouteMenuItem)}
          >
            <Text
              size="large"
              color={subRouteMenuItem.route === activeOption?.route ? 'accent' : 'primaryText'}
            >
              {subRouteMenuItem.label}
            </Text>
          </Box>
        ))}
      </Box>
    </StyledWrapper>
  );
};

export default MenuSubItems;
