import { Box, Layer } from 'grommet';
import styled, { css, DefaultTheme, StyledComponent, ThemedStyledProps } from 'styled-components';

import { Button } from '../../Buttons';
import { IButtonProps } from '../../Buttons/default-buttons/button';

type TModalButton = StyledComponent<
  (props: IButtonProps & { isMobile: boolean }) => JSX.Element,
  DefaultTheme,
  {},
  never
>;

type TModalButtonProps = ThemedStyledProps<IButtonProps & { isMobile: boolean }, DefaultTheme>;

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

const ModalButton: TModalButton = styled(Button)`
  height: auto;
  border-width: 0.1rem;
  font-size: ${(props: TModalButtonProps) => (props.isMobile ? '0.9rem' : '0.8rem')};
  padding: ${(props: TModalButtonProps) => (props.isMobile ? '0.75rem 0' : '0.3rem 0.7rem')};
  ${(props: TModalButtonProps) => {
    if (props.isMobile) {
      return css`
        width: 50%;
      `;
    }
    return;
  }}
`;

export { StyledLayer, ModalWrapper, ModalButton };
