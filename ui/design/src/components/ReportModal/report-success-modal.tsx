import React from 'react';
import { Box, Text } from 'grommet';

import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { StyledBox, ModalWrapper, ModalButton } from '../ListModal/styled-modal';

export interface IReportSuccessModalProps {
  className?: string;
  successTitleLabel: string;
  successMessageLabel?: string;
  contentId?: string;
  blockLabel?: string;
  closeLabel?: string;
  // screen size passed by viewport provider
  size?: string;
  // @TODO: make prop required, and modify all instances appropriately
  closeModal: () => void;
  signData?: any;
}

const ReportSuccessModal: React.FC<IReportSuccessModalProps> = props => {
  const { className, successTitleLabel, successMessageLabel, closeLabel, size, closeModal } = props;

  const handleModalClose =
    (blockUser = false) =>
    () => {
      if (blockUser) {
        /* @todo: replace with handler to block account */
      }
      closeModal();
    };

  return (
    <ModalWrapper isTransparent={true}>
      <StyledBox width={size === 'small' ? '90%' : '33%'}>
        <MainAreaCardBox className={className}>
          <Box direction="column" pad="large">
            <Box direction="row" margin={{ top: 'xsmall' }} align="start">
              <Text
                weight={600}
                margin={{ bottom: '1rem', horizontal: 'auto' }}
                size="large"
                textAlign="center"
              >
                {successTitleLabel}
              </Text>
            </Box>
            <Text
              weight="normal"
              margin={{ top: 'xsmall' }}
              color="secondaryText"
              size="large"
              textAlign="center"
              alignSelf="center"
            >
              {successMessageLabel}
            </Text>
            <Box direction="row" margin={{ top: 'large' }} alignSelf="center">
              {/* un-comment this to implement block user functionality */}

              {/* <ModalButton
                label={blockLabel}
                margin={{ right: '0.5rem' }}
                disabled={true}
                onClick={handleModalClose(true)}
              /> */}
              <ModalButton primary={true} label={closeLabel} onClick={handleModalClose()} />
            </Box>
          </Box>
        </MainAreaCardBox>
      </StyledBox>
    </ModalWrapper>
  );
};

ReportSuccessModal.defaultProps = {
  blockLabel: 'Block User',
  closeLabel: 'Close',
};

export default ReportSuccessModal;
