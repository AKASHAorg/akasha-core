import { Box, Drop } from 'grommet';
import styled from 'styled-components';

const StyledLayerElemDiv = styled.div`
  border-radius: ${props => props.theme.shapes.borderRadius}
  padding: ${props => `${props.theme.spacing.baseSpacing * 3}px`}
  border: 1px solid ${props => props.theme.colors.border}
  margin-bottom: ${props => `${props.theme.spacing.baseSpacing * 3}px`}
`;

const StyledDrop = styled(Drop)`
  margin-top: -10px;
  margin-left: 25px;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

const StyledSelectBox = styled(Box)`
  &:hover {
    cursor: pointer;
  }
`;

export { StyledLayerElemDiv, StyledDrop, StyledSelectBox };
