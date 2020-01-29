import { Box, Drop } from 'grommet';
import styled from 'styled-components';

const StyledLayerElemDiv = styled.div`
  border-radius: ${props => props.theme.shapes.borderRadius};
  padding: ${props => `${props.theme.shapes.baseSpacing * 3}px`};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: ${props => `${props.theme.shapes.baseSpacing * 3}px`};
`;

const StyledDrop = styled(Drop)`
  margin-top: -0.625em;
  margin-left: 1.563em;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

const StyledSelectBox = styled(Box)`
  &:hover {
    cursor: pointer;
  }
`;

export { StyledLayerElemDiv, StyledDrop, StyledSelectBox };
