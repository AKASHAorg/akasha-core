import * as React from 'react';
import Button from '../Button';
import { ModalCard } from '../EntryCard/basic-card-box';
import { ErrorInfoCard } from '../ErrorLoader/error-info-card';
import { ModalContainer } from '../SignInModal/fullscreen-modal-container';

export interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  cancelLabel: string;
  confirmLabel: string;
  closeLabel: string;
  modalTitle: string;
  textDetails: string | React.ReactElement;
  onClose: () => void;

  /**
   * pass the errorState into this prop
   */
  errors: Record<string, { error: Error; critical: boolean }>;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = props => {
  return (
    <ModalContainer onModalClose={props.onClose}>
      <ModalCard>
        <div>{props.modalTitle}</div>
        <div>{props.textDetails}</div>
        <ErrorInfoCard errors={props.errors}>
          {messages => {
            if (messages) {
              return (
                <>
                  <div>{messages}</div>
                  <Button label={props.closeLabel} onClick={props.onClose} />
                </>
              );
            }
            return (
              <>
                <Button label={props.cancelLabel} onClick={props.onClose} />
                <Button label={props.confirmLabel} color="red" onClick={props.onConfirm} />
              </>
            );
          }}
        </ErrorInfoCard>
      </ModalCard>
    </ModalContainer>
  );
};
ConfirmationModal.displayName = 'ConfirmationModal';
export default ConfirmationModal;
