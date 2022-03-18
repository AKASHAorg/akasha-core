import * as React from 'react';
import { Box, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';
import Button from '../Button';
import { ModalCard } from '../EntryCard/basic-card-box';
import { ModalWrapper, StyledBox } from '../ListModal/styled-modal';
import Icon from '../Icon';
import useBodyScrollLock from '../../utils/use-body-scroll-lock';
import { InstallStepIcon } from './install-step-icon';

export interface InstallModalProps {
  onCancel: () => void;
  onCloseModal: () => void;
  integrationName: string;
  cancelLabel: string;
  continueLabel: string;
  cancelTitleLabel: string;
  cancelSubtitleLabel: string;
  doneLabel: string;
  dismissLabel: string;
  modalTitleLabel: string;
  installTitleLabel1: string;
  installTitleLabel2: string;
  savingInfoLabel: string;
  downloadingResourcesLabel: string;
  successTitleLabel: string;
  successSubtitleLabel: string;
  successInfoLabel: string;
  successSubInfoLabel: string;
  errorTitleLabel: string;
  errorSubtitleLabel: string;
  errorInfoLabel: string;
  errorSubInfoLabel: string;
  /**
   * pass the errorState into this prop
   */
  error?: Error | null;
  installStep: number;
}

export enum ModalStates {
  INSTALLING = 'Installing',
  CANCEL = 'Cancel',
  ERROR = 'Error',
  SUCCESS = 'Success',
}

const InstallModal: React.FC<InstallModalProps> = props => {
  const {
    onCloseModal,
    onCancel,
    integrationName,
    cancelLabel,
    continueLabel,
    cancelTitleLabel,
    cancelSubtitleLabel,
    doneLabel,
    dismissLabel,
    modalTitleLabel,
    installTitleLabel1,
    installTitleLabel2,
    installStep,
    savingInfoLabel,
    downloadingResourcesLabel,
    successTitleLabel,
    successInfoLabel,
    successSubInfoLabel,
    successSubtitleLabel,
    errorInfoLabel,
    errorSubInfoLabel,
    errorSubtitleLabel,
    errorTitleLabel,
    error,
  } = props;

  useBodyScrollLock();

  const [modalState, setModalState] = React.useState(ModalStates.INSTALLING);

  const confirmCancel = () => {
    setModalState(ModalStates.CANCEL);
  };

  const handleCancel = () => {
    onCancel();
    onCloseModal();
  };

  const handleContinue = () => {
    setModalState(ModalStates.INSTALLING);
  };

  React.useEffect(() => {
    if (installStep > 2 && !error) {
      setModalState(ModalStates.SUCCESS);
    }
    if (installStep > 2 && error) {
      setModalState(ModalStates.ERROR);
    }
  }, [installStep, error]);

  return (
    <ModalWrapper isTransparent={true} isMobile={isMobileOnly} justify="center" align="center">
      <StyledBox>
        <ModalCard>
          {modalState === ModalStates.CANCEL && (
            <>
              <Box pad="medium" direction="column" align="center" gap="medium">
                <Text weight="bold" textAlign="center">
                  {cancelTitleLabel}
                </Text>
                <Text textAlign="center">{cancelSubtitleLabel}</Text>
              </Box>
              <Box direction="row" gap="small" justify="center" pad={{ top: 'medium' }}>
                <Button label={cancelLabel} onClick={handleCancel} />
                <Button primary={true} label={continueLabel} onClick={handleContinue} />
              </Box>
            </>
          )}
          {modalState === ModalStates.INSTALLING && (
            <>
              <Box
                direction="row"
                pad="medium"
                align="center"
                border={{ side: 'bottom', color: 'border' }}
              >
                <Icon
                  type="arrowLeft"
                  onClick={confirmCancel}
                  clickable={true}
                  accentColor={true}
                />
                <Text size="large" margin={{ vertical: '0', horizontal: 'auto' }}>
                  {modalTitleLabel}
                </Text>
              </Box>
              <Box
                pad="medium"
                direction="column"
                align="start"
                gap="medium"
                border={{ side: 'bottom', color: 'border' }}
              >
                <Text weight="bold">
                  {installTitleLabel1} {integrationName} {installTitleLabel2}{' '}
                </Text>

                <Box direction="row" gap="small">
                  <InstallStepIcon loading={installStep === 1} success={installStep > 1} />
                  <Text>{savingInfoLabel}</Text>
                </Box>
                <Box direction="row" gap="small">
                  <InstallStepIcon loading={installStep === 2} success={installStep > 2} />
                  <Text>{downloadingResourcesLabel}</Text>
                </Box>
              </Box>
              <Box direction="row" justify="end" pad={{ top: 'medium' }}>
                <Button label={cancelLabel} onClick={confirmCancel} />
              </Box>
            </>
          )}
          {modalState === ModalStates.ERROR && (
            <>
              <Box
                direction="row"
                pad="medium"
                align="center"
                border={{ side: 'bottom', color: 'border' }}
              >
                <Icon
                  type="arrowLeft"
                  onClick={confirmCancel}
                  clickable={true}
                  accentColor={true}
                />
                <Text size="large" margin={{ vertical: '0', horizontal: 'auto' }}>
                  {modalTitleLabel}
                </Text>
              </Box>
              <Box
                pad="medium"
                direction="column"
                justify="center"
                align="center"
                gap="medium"
                border={{ side: 'bottom', color: 'border' }}
              >
                <Box gap="xsmall">
                  <Icon type="error" size="xl" accentColor={true} />
                  <Text weight="bold" textAlign="center">
                    {errorTitleLabel}
                  </Text>
                </Box>
                <Box gap="medium">
                  <Text weight="bold" textAlign="center">
                    {integrationName} {errorSubtitleLabel}
                  </Text>
                  <Text textAlign="center">{errorInfoLabel}</Text>
                  <Text textAlign="center">{errorSubInfoLabel}</Text>
                </Box>
              </Box>
              <Box direction="row" justify="end" pad={{ top: 'medium' }}>
                <Button primary={true} label={dismissLabel} onClick={onCloseModal} />
              </Box>
            </>
          )}
          {modalState === ModalStates.SUCCESS && (
            <>
              <Box
                direction="row"
                pad="medium"
                align="center"
                border={{ side: 'bottom', color: 'border' }}
              >
                <Icon
                  type="arrowLeft"
                  onClick={confirmCancel}
                  clickable={true}
                  accentColor={true}
                />
                <Text size="large" margin={{ vertical: '0', horizontal: 'auto' }}>
                  {modalTitleLabel}
                </Text>
              </Box>
              <Box
                pad="medium"
                direction="column"
                justify="center"
                align="center"
                gap="medium"
                border={{ side: 'bottom', color: 'border' }}
              >
                <Box gap="xsmall">
                  <Icon type="check" size="xl" color="green" />
                  <Text weight="bold" textAlign="center">
                    {successTitleLabel}
                  </Text>
                </Box>
                <Box gap="medium">
                  <Text textAlign="center" weight="bold">
                    {successSubtitleLabel}
                  </Text>
                  <Text textAlign="center">{successInfoLabel}</Text>
                  <Text textAlign="center">{successSubInfoLabel}</Text>
                </Box>
              </Box>
              <Box direction="row" justify="end" pad={{ top: 'medium' }}>
                <Button label={doneLabel} onClick={onCloseModal} />
              </Box>
            </>
          )}
        </ModalCard>
      </StyledBox>
    </ModalWrapper>
  );
};
InstallModal.displayName = 'InstallModal';
export default InstallModal;
