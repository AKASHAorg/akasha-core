import React from 'react';
import { IReportSuccessModalProps } from './report-success-modal';
export interface IReportModalProps extends IReportSuccessModalProps {
  titleLabel: string;
  optionsTitleLabel: string;
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
  reportLabel?: string;
  user?: string;
  contentType?: string;
  baseUrl?: string;
  size?: string;
  width: number;
}
declare const ReportModal: React.FC<IReportModalProps>;
export default ReportModal;
