import { Box } from 'grommet';
import styled from 'styled-components';

const StyledDiv = styled.div`
  padding-right: ${props => `${props.theme.shapes.baseSpacing}px`};
  color: ${props => props.theme.colors.accent};
  opacity: 0.4;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

const StyledCommentWrapper = styled(Box)`
  flex: 1 1 auto;
`;

export { StyledDiv, StyledCommentWrapper };
