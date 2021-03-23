import React from 'react';
import ReportModalComponent, { IReportModalProps } from './report-modal';
import ViewportSizeProvider from '../../Providers/viewport-dimension';

const ReportModal: React.FC<IReportModalProps> = props => {
  return (
    <ViewportSizeProvider>
      <ReportModalComponent {...props} />
    </ViewportSizeProvider>
  );
};

export default ReportModal;
