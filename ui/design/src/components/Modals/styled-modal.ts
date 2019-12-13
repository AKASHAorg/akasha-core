import { Layer } from 'grommet';
import styled from 'styled-components';

const StyledLayer = styled(Layer)`
  border-radius: ${props => props.theme.shapes.borderRadius};
`;

export { StyledLayer };
