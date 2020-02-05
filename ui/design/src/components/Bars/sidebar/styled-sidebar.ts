import { Box } from 'grommet';
import styled from 'styled-components';

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
  height: 15em;
`;

const StyledBottomDiv = styled.div`
  height: 1.25em;
`;

const SidebarBox = styled(Box)`
  width: 4em;
`;

export {
  StyledHiddenScrollContainer,
  SidebarBox,
  StyledAppsContainer,
  StyledUserSectionBox,
  StyledBottomDiv,
};
