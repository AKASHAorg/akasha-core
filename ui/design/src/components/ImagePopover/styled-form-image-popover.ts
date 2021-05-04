import { Box, Drop } from 'grommet';
import styled from 'styled-components';

const StyledDrop = styled(Drop)`
  width: 10.875rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

const StyledBox = styled(Box)`
  height: 2rem;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.colors.ultraLightGrey};
    svg {
      & * {
        stroke: ${props => props.theme.colors.accent};
      }
    }
    color: ${props => props.theme.colors.accent};
  }
`;

const StyledDeleteBox = styled(Box)`
  height: 2rem;
  cursor: pointer;
  svg {
    & * {
      stroke: red;
    }
  }
  color: red;
  &:hover {
    background-color: ${props => props.theme.colors.ultraLightGrey};
  }
`;

const StyledImageInput = styled.input`
  display: none;
`;

export { StyledDrop, StyledImageInput, StyledBox, StyledDeleteBox };
