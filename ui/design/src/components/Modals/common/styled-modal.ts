import { Box, Layer } from 'grommet';
import styled from 'styled-components';

const StyledLayer = styled(Layer)`
  max-width: 36.313em;
  border-radius: ${props => props.theme.shapes.borderRadius};
`;

const ModalWrapper = styled(Box)`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 199;
  background: ${props => props.theme.colors.modalBackground};
`;

export { StyledLayer, ModalWrapper };
