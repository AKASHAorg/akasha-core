import React from 'react';
import { Box, Text } from 'grommet';

import { MainAreaCardBox } from '../../Cards/common/basic-card-box';
import { ModalWrapper } from '../common/styled-modal';
import { Button } from '../../Buttons';

import { StyledBox } from '../styled';

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
  updateEntry?: (entryId: string) => void;
  closeModal: () => void;
}

const ReportSuccessModal: React.FC<IReportSuccessModalProps> = props => {
  const {
    className,
    successTitleLabel,
    successMessageLabel,
    contentId,
    closeLabel,
    size,
    updateEntry,
    closeModal,
  } = props;

  const handleModalClose = () => {
    if (updateEntry && contentId) {
      updateEntry(contentId);
    }
    closeModal();
  };

  return (
    <ModalWrapper>
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
              <Button primary={true} label={closeLabel} onClick={handleModalClose} />
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
