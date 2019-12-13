import { Box } from 'grommet';
import { Editable } from 'slate-react';
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

const StyledIconDiv = styled.div`
  display: flex;
  align-items: center;
`;

const StyledBox = styled(Box)`
  min-height: 200px;
  max-height: 612px;
`;

const StyledEditable = styled(Editable)`
  ::selection {
    background-color: ${props => props.theme.colors.accent};
  }
`;

export { StyledBox, StyledDiv, StyledEditable, StyledIconDiv };
