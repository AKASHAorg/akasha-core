import { Box } from 'grommet';
import styled, { css } from 'styled-components';

const StyledHiddenScrollContainer = styled.div`
  overflow: auto;
  height: 100%;
  width: 100%
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;

const StyledUserSectionBox = styled(Box)`
  height: 11em;
`;

const StyledBottomDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4em;
`;

const SidebarBox = styled(Box)`
  width: 4em;
`;

const SecondarySidebarBox = styled(Box)`
  width: 10.8em;
  background-color: ${props => props.theme.colors.lightestGrey};
`;

const SecondarySidebarContentWrapper = styled.div`
  width: 8.75em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledAppIconWrapper = styled.div<{ active: boolean; hovered?: boolean }>`
  width: 2.25em;
  height: 2.25em;
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

const StyledVerticalPad = styled.div`
  display: flex;
  align-items: center;
  height: 3.063em;
  width: 100%;
`;

const StyledBorderBox = styled(Box)<{ active: boolean; hovered?: boolean }>`
  height: 2.25em;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => {
    if (props.hovered) {
      return css`
        margin-left: 0.3em;
        height: 3.063em;
        box-shadow: ${props.theme.colors.shadow};
        border-top-left-radius: ${props.theme.shapes.borderRadius};
        border-bottom-left-radius: ${props.theme.shapes.borderRadius};
        // background-color: ${props.theme.colors.mediumGrey}
        border: 1px solid ${props.theme.colors.border};
        border-right-color: ${props.theme.colors.background};
      `;
    }
    if (props.active) {
      return css`
        border-left: 2px solid ${props.theme.colors.accent};
      `;
    }
    return css`
      opacity: 0.4;
      border-left: 2px solid ${props.theme.colors.background};
    `;
  }}
`;

const StyledAppOptionBox = styled(Box)`
  background-color: ${props => props.theme.colors.lightBackground};
`;

const StyledMobileHeaderBox = styled(Box)`
  height: 6em;
`;

const StyledMobileFooterBox = styled(Box)`
  height: 5em;
`;

export {
  StyledHiddenScrollContainer,
  SidebarBox,
  SecondarySidebarBox,
  StyledUserSectionBox,
  StyledBottomDiv,
  SecondarySidebarContentWrapper,
  StyledAppIconWrapper,
  StyledAppOptionBox,
  StyledMobileHeaderBox,
  StyledMobileFooterBox,
  StyledVerticalPad,
  StyledBorderBox,
};
