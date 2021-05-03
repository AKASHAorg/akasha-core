import React from 'react';
import ModerateModalComponent, { IModerateModalProps } from './moderate-modal';
import ViewportSizeProvider from '../Providers/viewport-dimension';

const ModerateModal: React.FC<IModerateModalProps> = props => {
  return (
    <ViewportSizeProvider>
      <ModerateModalComponent {...props} />
    </ViewportSizeProvider>
  );
};

export default ModerateModal;
