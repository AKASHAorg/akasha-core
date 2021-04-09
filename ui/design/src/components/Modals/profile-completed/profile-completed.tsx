import React from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Box, Text, Image } from 'grommet';

import { ModalWrapper, ContentWrapper, ModalButton } from '../common/styled-modal';

export interface IProfileCompletedModalProps {
  assetName?: string;
  publicImgPath?: string;
  titleLabel: string;
  subtitleLabel: string;
  buttonLabel: string;
  onClick: () => void;
}

const ProfileCompletedModal: React.FC<IProfileCompletedModalProps> = props => {
  const {
    assetName = 'profile-completed',
    publicImgPath = '/images',
    titleLabel,
    subtitleLabel,
    buttonLabel,
    onClick,
  } = props;

  return (
    <ModalWrapper>
      <ContentWrapper width={isMobileOnly ? '95%' : '22rem'}>
        <Box width="100%" margin={{ bottom: 'small' }} alignSelf="center">
          <Image fit="contain" src={`${publicImgPath}/${assetName}.png`} />
        </Box>
        <Box width="100%" direction="column" align="center">
          <Text
            weight={600}
            margin={{ bottom: '0.75rem', horizontal: 'auto' }}
            size="large"
            textAlign="center"
          >
            {titleLabel}
          </Text>
          <Text
            weight="normal"
            size="large"
            textAlign="center"
            style={{ lineHeight: '1.6', marginBottom: '0.75rem' }}
          >
            {subtitleLabel}
          </Text>
          <ModalButton
            primary={true}
            label={buttonLabel}
            isMobile={isMobileOnly}
            onClick={onClick}
          />
        </Box>
      </ContentWrapper>
    </ModalWrapper>
  );
};

export default ProfileCompletedModal;
