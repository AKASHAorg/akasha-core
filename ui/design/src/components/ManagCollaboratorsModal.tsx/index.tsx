import React from 'react';
import { Box, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';

import Icon from '../Icon';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { StyledBox, ModalWrapper, StyledModalBox } from '../ListModal/styled-modal';
import { useViewportSize } from '../Providers/viewport-dimension';

export interface IManageCollaboratorsModalProps {
  className?: string;
  titleLabel: string;
  closeModal: () => void;
}

const ManageCollaboratorsModal: React.FC<IManageCollaboratorsModalProps> = props => {
  const { className, titleLabel, closeModal } = props;

  const {
    dimensions: { width },
  } = useViewportSize();

  return (
    <ModalWrapper isTransparent={true} isMobile={isMobileOnly} justify="center" align="center">
      <StyledBox width={width > 800 ? '35%' : width > 500 ? '50%' : '100%'}>
        <MainAreaCardBox className={className}>
          <StyledModalBox pad="large">
            <Box direction="row" margin={{ top: 'xsmall' }} align="start">
              {isMobileOnly && (
                <Icon
                  type="arrowLeft"
                  color="secondaryText"
                  clickable={true}
                  onClick={closeModal}
                />
              )}
              <Text weight={600} margin={{ bottom: '1rem', horizontal: 'auto' }} size="large">
                {titleLabel}
              </Text>
              {!isMobileOnly && (
                <Icon type="close" color="secondaryText" clickable={true} onClick={closeModal} />
              )}
            </Box>
          </StyledModalBox>
        </MainAreaCardBox>
      </StyledBox>
    </ModalWrapper>
  );
};

export default ManageCollaboratorsModal;
