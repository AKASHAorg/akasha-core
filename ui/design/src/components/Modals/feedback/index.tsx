import React from 'react';
import FeedbackModalComponent, { IFeedbackModalProps } from './feedback-modal';
import ViewportSizeProvider from '../../Providers/viewport-dimension';

const FeedbackModal: React.FC<IFeedbackModalProps> = props => {
  return (
    <ViewportSizeProvider>
      <FeedbackModalComponent {...props} />
    </ViewportSizeProvider>
  );
};

export default FeedbackModal;
