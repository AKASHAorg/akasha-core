import { Box, Drop } from 'grommet';
import styled from 'styled-components';

const StyledLayerElemDiv = styled.div`
  border-radius: ${props => props.theme.shapes.borderRadius};
  padding: ${props => `${props.theme.shapes.baseSpacing * 3}px`};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: ${props => `${props.theme.shapes.baseSpacing * 3}px`};
`;

const StyledDrop = styled(Drop)`
  z-index: 10;
  position: fixed;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

const StyledProfileDrop = styled(Drop)`
  position: fixed;
  border-radius: ${props => props.theme.shapes.borderRadius};
`;

const StyledSelectBox = styled(Box)`
  padding: ${props => `${props.theme.shapes.baseSpacing}px`};
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  &:hover {
    background-color: ${props => props.theme.colors.lightBackground};
    cursor: pointer;
  }
`;

export { StyledLayerElemDiv, StyledDrop, StyledProfileDrop, StyledSelectBox };
