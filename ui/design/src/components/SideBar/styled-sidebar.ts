import { AccordionPanel, Box, Text } from 'grommet';
import styled, { css } from 'styled-components';

const StyledHiddenScrollContainer = styled.div`
  overflow: auto;
  height: 100%;
  width: 100%;
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
  align-items: center;
  justify-content: center;
  height: 4rem;
`;

const StyledAppIconWrapper = styled.div<{ active: boolean; hovered?: boolean }>`
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.background};
  ${props => {
    if (props.active) {
      return css`
        box-shadow: 0 0 4px 0 rgba(83, 98, 124, 0.2);
      `;
    }
    return;
  }}
`;

const StyledAppOptionBox = styled(Box)<{ active: boolean }>`
  background-color: ${props => props.theme.colors.background};
  ${props => {
    if (props.active) {
      return css`
        border-left: 2px solid ${props.theme.colors.accent};
      `;
    }
    return css`
      border-left: 1px solid ${props.theme.colors.border};
    `;
  }}
`;

const StyledMobileFooterBox = styled(Box)``;

const StyledText = styled(Text)`
  cursor: pointer;
`;

const StyledAccordionPanel = styled(AccordionPanel)<{ size?: string }>`
  ${props => {
    if (props.size === 'small') {
      return;
    }
    return css`
      div:nth-child(2) {
        svg {
          stroke: ${props.theme.colors.background};
        }
      }
      &:hover {
        div:nth-child(2) {
          svg {
            stroke: ${props.theme.colors.border};
          }
        }
      }
    `;
  }}
`;

export {
  StyledHiddenScrollContainer,
  StyledFooter,
  StyledAppIconWrapper,
  StyledAppOptionBox,
  StyledMobileFooterBox,
  StyledMobileHRDiv,
  StyledText,
  StyledAccordionPanel,
};
