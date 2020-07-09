import styled, { css } from 'styled-components';
import { Box } from 'grommet';

const StyledTimeline = styled.div`
  position: absolute;
  width: 5.5rem;
  height: 2px;
  background-color: ${props => props.theme.colors.border};
`;

const StyledProgressBar = styled.div<{ state: 0 | 1 | 2 }>`
  height: 100%;
  background-color: ${props => props.theme.colors.accent};
  ${props => {
    if (props.state === 1) {
      return css`
        width: 50%;
      `;
    }
    if (props.state === 2) {
      return css`
        width: 100%;
      `;
    }
    return css`
      width: 0;
    `;
  }}
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 5.5rem;
`;

const StyledNodesBox = styled(Box)`
  z-index: 1;
  margin-top: -0.5rem;
`;

export { StyledTimeline, StyledProgressBar, StyledContainer, StyledNodesBox };
