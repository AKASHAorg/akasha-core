import { Box } from 'grommet';
import styled, { css } from 'styled-components';

const StyledHiddenScrollContainer = styled.div`
  overflow: auto;
  height: 100%;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;

const StyledAppsContainer = styled.div`
  height: 90%;
`;

const StyledUserSectionBox = styled(Box)`
  height: 11em;
`;

const StyledBottomDiv = styled.div`
  height: 1.25em;
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

const StyledAppIconWrapper = styled.div<{ active: boolean }>`
  width: 2.25em;
  height: 2.25em;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.background};
  ${props => {
    if (props.active) {
      return css`
        box-shadow: 0 0 4px 0 rgba(83, 98, 124, 0.2);
      `;
    }
    return css`
      opacity: 0.4;
    `;
  }}
`;

export {
  StyledHiddenScrollContainer,
  SidebarBox,
  SecondarySidebarBox,
  StyledAppsContainer,
  StyledUserSectionBox,
  StyledBottomDiv,
  SecondarySidebarContentWrapper,
  StyledAppIconWrapper,
};
