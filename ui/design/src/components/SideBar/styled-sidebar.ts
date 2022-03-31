import { Accordion, AccordionPanel } from 'grommet';
import styled, { css } from 'styled-components';

import Button from '../Button';

const StyledHiddenScrollContainer = styled.div`
  overflow: auto;
  width: 100%;
  margin-bottom: 3.5rem;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;

const StyledMobileHRDiv = styled.div`
  margin: 0 ${props => (props.theme.shapes.baseSpacing * 3) / 16}rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const StyledFooter = styled.div`
  display: flex;
  width: 100%;
  position: absolute;
  bottom: 0;
  border-top: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.cardBackground};
`;

const StyledAppIconWrapper = styled.div<{
  hovered?: boolean;
  backgroundColor?: string;
}>`
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${props => props.backgroundColor || props.theme.colors.background};
`;

const StyledAccordion = styled(Accordion)`
  width: 100%;
`;

const StyledAccordionPanel = styled(AccordionPanel)<{
  size?: string;
  hasChevron?: boolean;
  isActive?: boolean;
}>`
  background-color: ${props =>
    props.isActive ? props.theme.colors.activePanelBackground : 'initial'};

  &:hover {
    background-color: ${props => props.theme.colors.hoverPanelBackground};
  }

  ${props => {
    return css`
      div:nth-child(2) {
        svg {
          display: ${props.hasChevron ? 'initial' : 'none'};
          stroke: ${props.isActive ? props.theme.colors.accent : props.theme.colors.primaryText};
        }
      }
    `;
  }}
`;

const MobileAccordionPanel = styled(StyledAccordionPanel)`
  display: none;
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    display: flex;
    margin: 0.5rem 0;
  }
`;

const DesktopAccordionPanel = styled(StyledAccordionPanel)`
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    display: none;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: auto;
  border-width: 1px;
`;

export {
  StyledHiddenScrollContainer,
  StyledFooter,
  StyledAppIconWrapper,
  StyledMobileHRDiv,
  StyledAccordion,
  StyledAccordionPanel,
  MobileAccordionPanel,
  DesktopAccordionPanel,
  StyledButton,
};
