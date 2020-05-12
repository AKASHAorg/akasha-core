import * as React from 'react';
import DS from '@akashaproject/design-system';
import ReactDOM from 'react-dom';

const { Box } = DS;

export interface IModalContainerProps {
  onModalClose: () => void;
}

export const ModalContainer: React.FC<IModalContainerProps> = props => {
  return (
    <Box
      fill={true}
      pad={{ top: '2em' }}
      align="center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}
    >
      <Box
        style={{ zIndex: 10 }}
        animation={{
          type: 'slideDown',
          duration: 250,
          delay: 0,
        }}
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
    </Box>
  );
};

export const Modal: React.FC<{ slotId?: string }> = props => {
  const { children, slotId } = props;
  if (!slotId) {
    return null;
  }
  const modalRootEl = document.getElementById(slotId);
  if (modalRootEl) {
    return ReactDOM.createPortal(children, modalRootEl);
  }
  // TODO: handle this more seriously!
  return null;
};

