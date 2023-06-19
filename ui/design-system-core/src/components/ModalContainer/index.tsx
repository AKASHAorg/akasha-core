import React, { PropsWithChildren } from 'react';
import { keyframes, css, apply } from '@twind/core';

import Box from '../Box';

export interface IModalContainerProps {
  onModalClose?: () => void;
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  children?: React.ReactNode;
}

const ModalContainer: React.FC<PropsWithChildren<IModalContainerProps>> = props => {
  const { style, children, onModalClose } = props;

  const innerStyle = Object.assign({ zIndex: 10 }, props.innerStyle);

  const positionClass = apply(`top-0 left-0 bottom-0 right-0`);

  const fadeIn = keyframes`
  0% {
    opacity: 0
  }
  100% {
    opacity: 1
  }
`;

  const fadeInClass = css`
    animation: 0.25s ${fadeIn} ease-out;
  `;

  return (
    <Box
      customStyle={`flex w-full items-center justify-items-center justify-center fixed ${positionClass}`}
      style={style}
    >
      <Box
        customStyle={`flex items-center justify-items-center h-screen ${fadeInClass}`}
        style={innerStyle}
      >
        {children}
      </Box>

      <Box
        customStyle={`absolute ${positionClass} bg-white/60 ${fadeInClass}`}
        onClick={onModalClose}
      />
    </Box>
  );
};

export default ModalContainer;
