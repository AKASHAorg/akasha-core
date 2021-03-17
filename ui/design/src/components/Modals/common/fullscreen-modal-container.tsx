import * as React from 'react';
import { Box, BoxProps } from 'grommet';
import styled from 'styled-components';

export interface IModalContainerProps {
  onModalClose?: () => void;
  style?: React.CSSProperties;
  animation?: BoxProps['animation'];
}
const StyledModalWrapper = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;
export const ModalContainer: React.FC<IModalContainerProps> = props => {
  return (
    <StyledModalWrapper fill={true} justify="center" align="center" style={props.style}>
      <Box
        style={{ zIndex: 10 }}
        animation={
          props.animation || {
            type: 'slideDown',
            duration: 250,
            delay: 0,
          }
        }
      >
        {props.children}
      </Box>
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 0,
        }}
        animation={{
          type: 'fadeIn',
          duration: 250,
          delay: 0,
        }}
        onClick={props.onModalClose}
      />
    </StyledModalWrapper>
  );
};
