import { Box, Text } from 'grommet';
import styled from 'styled-components';

const StyledPlainButton = styled(Box)`
  padding: 0 0.8em;
  color: ${props =>
    props.color ? props.theme.colors[props.color] : props.theme.colors.secondaryText};
  svg {
    height: 100%;
    width: 1.25rem;
    stroke: ${props => props.theme.colors.lightGrey};
    & * {
      stroke: ${props => props.theme.colors.secondaryText};
    }
  }
`;

const StyledText = styled(Text)`
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

export { StyledPlainButton, StyledText };
