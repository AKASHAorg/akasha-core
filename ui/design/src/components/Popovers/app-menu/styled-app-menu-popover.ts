import { Drop } from 'grommet';
import styled from 'styled-components';

const StyledDrop = styled(Drop)`
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  width: 10em;
  margin-left: 2.9em;
`;

export { StyledDrop };
