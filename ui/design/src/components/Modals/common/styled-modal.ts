import { Box, Layer } from 'grommet';
import styled, { css } from 'styled-components';

import { Button } from '../../Buttons';

export interface IMobileProps {
  readonly isMobile?: boolean;
}
export interface IOptionalButtonProps extends IMobileProps {
  readonly isOnFeedback?: boolean;
}

export interface IModalWrapperProps extends IMobileProps {
  readonly isTransparent?: boolean;
}

const StyledLayer = styled(Layer)`
  max-width: 36.313em;
  @media only screen and (min-width: ${props => props.theme.breakpoints.small.value}px) {
    max-width: 22rem;
  }
  width: 100%;
  border-radius: ${props => props.theme.shapes.borderRadius};
`;

const ModalWrapper = styled(Box)<IModalWrapperProps>`
  width: 100vw;
  height: 100vh;
  position: fixed;
  cursor: auto;
  left: 0;
  top: 0;
  z-index: 199;
  background: ${props =>
    props.isTransparent
      ? props.theme.colors.modalBackgroundTransparent
      : props.theme.colors.modalBackgroundAlt};
  ${props => {
    if (props.isMobile) {
      return css`
        background: ${props.theme.colors.background};
      `;
    }
    return;
  }}
`;

const StyledContentArea = styled(Box)<IMobileProps>`
  background: ${props => props.theme.colors.background};
  border-radius: 0.5rem;
  padding: 3rem 0 0;
  position: absolute;
  top: ${props => (props.isMobile ? '0%' : '50%')};
  left: 50%;
  transform: ${props => (props.isMobile ? 'translate(-50%, 0%)' : 'translate(-50%, -50%)')};
  -ms-transform: ${props => (props.isMobile ? 'translate(-50%, 0%)' : 'translate(-50%, -50%)')};
  width: 100%;
  @media only screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    width: 75%;
    padding: 3rem 3rem 0;
  }
  @media only screen and (min-width: ${props => props.theme.breakpoints.large.value}px) {
    width: 50%;
    padding: 3rem 3rem 0;
  }
  @media only screen and (min-width: ${props => props.theme.breakpoints.xlarge.value}px) {
    width: 35%;
    padding: 3rem 3rem 0;
  }
`;

const StyledButtonWrapper = styled(Box)`
  margin: 1rem 0;
  width: 100%;
  justify-content: center;
`;

const ModalButton = styled(Button)<IOptionalButtonProps>`
  height: auto;
  border-width: 1px;
  font-size: ${props => (props.isMobile ? '0.9rem' : '0.8rem')};
  padding: 0.3rem 0.7rem;
  ${props => {
    if (props.isMobile) {
      return css`
        width: 50%;
      `;
    }
    if (props.isOnFeedback) {
      return css`
        min-width: 8.8rem;
      `;
    }
    return;
  }}
`;

const StyledFooterArea = styled(Box)`
  margin-top: 0.5rem;
  border-top: 0.05rem solid ${props => props.theme.colors.border};
  padding: 1.5rem 0.5rem;
  @media only screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    padding: 1.5rem 2rem;
  }
  @media only screen and (min-width: ${props => props.theme.breakpoints.large.value}px) {
    padding: 1.5rem 1rem;
  }
  @media only screen and (min-width: ${props => props.theme.breakpoints.xlarge.value}px) {
    padding: 1.5rem 0.5rem;
  }
`;

export {
  StyledLayer,
  ModalWrapper,
  StyledContentArea,
  StyledButtonWrapper,
  ModalButton,
  StyledFooterArea,
};
