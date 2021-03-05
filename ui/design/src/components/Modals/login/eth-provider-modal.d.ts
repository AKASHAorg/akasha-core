import * as React from 'react';
export interface IProviderModalProps {
  onModalClose: () => void;
  onLogin: () => void;
  headLine: string;
  message: string;
  illustration: React.ReactElement;
  error: string | null;
  isMobile?: boolean;
}
declare const ProviderAuthModal: React.FC<IProviderModalProps>;
export default ProviderAuthModal;
