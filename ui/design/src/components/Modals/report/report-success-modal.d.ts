import React from 'react';
export interface IReportSuccessModalProps {
  className?: string;
  successTitleLabel: string;
  successMessageLabel?: string;
  contentId?: string;
  blockLabel?: string;
  closeLabel?: string;
  size?: string;
  updateEntry?: (entryId: string) => void;
  closeModal: () => void;
}
declare const ReportSuccessModal: React.FC<IReportSuccessModalProps>;
export default ReportSuccessModal;
