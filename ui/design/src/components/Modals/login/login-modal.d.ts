import * as React from 'react';
export interface LoginModalProps {
  slotId: string;
  onLogin: (providerId: number) => void;
  showModal: boolean;
  onModalClose: () => void;
  titleLabel: string;
  /**
   * text to be displayed when the user selects to login with metamask
   */
  metamaskModalHeadline: string;
  /**
   * additional message to be displayed when the user selects to login with metamask
   */
  metamaskModalMessage: string;
  error: string | null;
}
declare const LoginModal: React.FC<LoginModalProps>;
export interface IWalletConnectModalProps {
  onLogin: () => void;
}
export default LoginModal;
