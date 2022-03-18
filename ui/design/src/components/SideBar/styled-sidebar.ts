import { AccordionPanel } from 'grommet';
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
  background-color: ${props => props.theme.colors.background};
`;

const StyledAppIconWrapper = styled.div<{
  active: boolean;
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
  ${props => {
    if (props.active) {
      return css`
        box-shadow: 0 0 4px 0 rgba(83, 98, 124, 0.2);
      `;
    }
    return;
  }}
`;

const StyledAccordionPanel = styled(AccordionPanel)<{
  size?: string;
  hasChevron?: boolean;
}>`
  &:hover {
    background-color: ${props => props.theme.colors.lightBackground};
  }
  ${props => {
    return css`
      div:nth-child(2) {
        svg {
          stroke: ${props.hasChevron
            ? props.theme.colors.primaryText
            : props.theme.colors.background};
        }
      }
      &:hover {
        div:nth-child(2) {
          svg {
            stroke: ${props.hasChevron
              ? props.theme.colors.accent
              : props.theme.colors.lightBackground};
          }
        }
      }
    `;
  }}
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: auto;
`;

export {
  StyledHiddenScrollContainer,
  StyledFooter,
  StyledAppIconWrapper,
  StyledMobileHRDiv,
  StyledAccordionPanel,
  StyledButton,
};
