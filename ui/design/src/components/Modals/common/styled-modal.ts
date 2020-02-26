import { Layer } from 'grommet';
import styled from 'styled-components';

const StyledLayer = styled(Layer)`
  max-width: 36.313em;
  border-radius: ${props => props.theme.shapes.borderRadius};
`;

export { StyledLayer };
