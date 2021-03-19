import styled, { css } from 'styled-components';
import { Box, Button, Text, Drop, AccordionPanel } from 'grommet';
import { Icon } from '../../Icon';

const TopbarWrapper = styled(Box)`
  background-color: ${props => props.theme.colors.background};
`;

const StyledText = styled(Text)`
  cursor: pointer;
  font-weight: 450;
`;

const StyledSearchContainer = styled(Box)`
  flex-grow: 1;
  align-items: flex-end;
`;

const StyledDrop = styled(Drop)`
  z-index: 1000;
  margin-top: 5px;
  min-width: 5rem;
`;

const StyledDiv = styled.div`
  cursor: pointer!;
`;

const BrandIcon = styled(Icon)`
  &:hover {
    & * {
      stroke: none;
    }
  }
`;

const MenuIcon = styled(Icon)<{ rotate?: number }>`
  transform: ${props => `rotate(${props.rotate || 0}deg)`};
`;

const VersionButton = styled(Button)`
  padding: 0.125rem 0.375rem;
  &:hover {
    box-shadow: none;
  }
  color: ${props => props.theme.colors.white};
  font-weight: 700;
  font-size: 9.5px;
  line-height: 11px;
  user-select: none;
`;

const StyledPopoverBox = styled(Box)`
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  width: 100%;
  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.ultraLightBackground};
  }
`;

const StyledOverlay = styled(Box)`
  background-color: ${props => props.theme.colors.background};
  width: 80vw;
  height: 100vh;
`;

const StyledAccordionPanel = styled(AccordionPanel)<{ isMobile?: boolean }>`
  margin: ${props => `${(props.theme.shapes.baseSpacing * 2) / 16}rem`};
  ${props => {
    if (props.isMobile) {
      return;
    }
    return css`
      div:nth-child(2) {
        svg {
          stroke: ${props.theme.colors.background};
        }
      }
      &:hover {
        background-color: ${props => props.theme.colors.ultraLightBackground};
        div:nth-child(2) {
          svg {
            stroke: ${props.theme.colors.primaryText};
          }
        }
      }
    `;
  }}
`;

const IconDiv = styled(Box)<{ isActive: boolean }>`
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  ${props => {
    if (props.isActive) {
      return css`
        background-color: ${props => props.theme.colors.accentOpacity};
      `;
    }
    return css`
      background-color: ${props => props.theme.colors.background};
    `;
  }}
`;

export {
  TopbarWrapper,
  StyledText,
  StyledSearchContainer,
  StyledDrop,
  StyledDiv,
  IconDiv,
  BrandIcon,
  MenuIcon,
  VersionButton,
  StyledPopoverBox,
  StyledOverlay,
  StyledAccordionPanel,
};
