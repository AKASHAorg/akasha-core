import * as React from 'react';
export interface IModalContainerProps {
  onModalClose?: () => void;
  style?: React.CSSProperties;
}
export declare const ModalContainer: React.FC<IModalContainerProps>;
