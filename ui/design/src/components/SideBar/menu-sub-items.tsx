import React from 'react';
import { Box, Text, Anchor } from 'grommet';
import styled from 'styled-components';

import { IMenuItem } from '@akashaorg/typings/ui';

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

const StyledAnchor = styled(Anchor)<{ borderColor: string }>`
  display: flex;
  padding: 1.25rem 0 1.25rem 1.25rem;
  border-left: 0.25rem solid ${({ theme, borderColor }) => theme.colors[borderColor]};
  color: unset;
  font-weight: unset;
  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

const MenuSubItems: React.FC<IMenuSubItemsProps> = props => {
  const { isMobile, menuItem, activeOption, onOptionClick } = props;

  const subRoutes = menuItem.subRoutes.sort((a: IMenuItem, b: IMenuItem) => {
    return a.index - b.index;
  });

  return (
    <StyledWrapper pad={{ horizontal: 'medium' }} isMobile={isMobile}>
      <Box direction="column" justify="evenly" margin={{ left: 'medium' }}>
        {subRoutes.map((subRouteMenuItem, idx) => (
          <StyledAnchor
            href={`${location.origin}${subRouteMenuItem.route}`}
            key={idx + subRouteMenuItem.label}
            borderColor={subRouteMenuItem.route === activeOption?.route ? 'accent' : 'border'}
            onClick={e => {
              e.preventDefault();
              onOptionClick(menuItem, subRouteMenuItem);
            }}
          >
            <Text size="large">{subRouteMenuItem.label}</Text>
          </StyledAnchor>
        ))}
      </Box>
    </StyledWrapper>
  );
};

export default MenuSubItems;
