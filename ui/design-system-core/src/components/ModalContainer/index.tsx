import * as React from 'react';
import { tw, keyframes, css, apply } from '@twind/core';

export interface IModalContainerProps {
  onModalClose?: () => void;
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  children?: React.ReactNode;
}

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
const ModalContainer: React.FC<IModalContainerProps> = props => {
  const innerStyle = Object.assign({ zIndex: 10 }, props.innerStyle);
  return (
    <div
      className={tw(`flex w-full items-center justify-items-center fixed ${positionClass}`)}
      style={props.style}
    >
      <div
        className={tw(`flex items-center justify-items-center h-screen ${fadeInClass}`)}
        style={innerStyle}
      >
        {props.children}
      </div>
      <div
        className={tw(`absolute ${positionClass} bg-white/60 ${fadeInClass}`)}
        onClick={props.onModalClose}
      />
    </div>
  );
};

export default ModalContainer;
