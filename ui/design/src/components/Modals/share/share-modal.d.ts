import * as React from 'react';
export declare type ServiceNames = 'twitter' | 'reddit' | 'facebook' | 'copy';
export interface IShareModal {
  className?: string;
  link: string;
  closeModal: () => void;
  handleProfileShare: (serviceName: ServiceNames, link: string) => void;
  copyLabel?: string;
  shareTitleLabel?: string;
  shareSubtitleLabel?: string;
  shareSocialLabel?: string;
}
declare const ShareModal: React.FC<IShareModal>;
export default ShareModal;
