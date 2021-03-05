import React from 'react';
export interface IModerateModalProps {
  className?: string;
  titleLabel: string;
  altTitleLabel: string;
  contentType: string;
  decisionLabel: string;
  optionLabels: string[];
  descriptionLabel: string;
  descriptionPlaceholder: string;
  footerText1Label: string;
  footerLink1Label: string;
  footerUrl1: string;
  footerText2Label: string;
  footerLink2Label: string;
  footerUrl2: string;
  cancelLabel?: string;
  user: string | null;
  contentId?: string;
  baseUrl: string;
  isReview?: boolean;
  size?: string;
  width: number;
  onModalClose: () => void;
  closeModal: () => void;
  signData: (data: object | string) => any;
}
declare const ModerateModal: React.FC<IModerateModalProps>;
export default ModerateModal;
