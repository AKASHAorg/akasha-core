import { Box, Layer } from 'grommet';
import styled from 'styled-components';

const StyledLayer = styled(Layer)`
  max-width: 36.313em;
  @media only screen and (min-width: ${props => props.theme.breakpoints.small.value}px) {
    max-width: 22rem;
  }
  width: 100%;
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
