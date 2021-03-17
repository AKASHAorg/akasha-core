import React from 'react';
import { isMobile } from 'react-device-detect';
import { Box, Text, Image } from 'grommet';

import {
  ModalWrapper,
  StyledContentArea,
  StyledButtonWrapper,
  StyledFooterArea,
  ModalButton,
} from '../common/styled-modal';

import { Icon } from '../../Icon';

export interface IFeedbackModalProps {
  boxSize: string;
  assetName: string;
  publicImgPath?: string;
  imageBoxHasMargin?: boolean;
  titleLabel: string;
  subtitleLabel: string;
  openAnIssueLabel: string;
  emailUsLabel: string;
  footerTextLabel: string;
  footerLinkText1Label: string;
  footerLinkText2Label: string;
  onOpenAnIssueClick: () => void;
  onEmailUsClick: () => void;
  onJoinDiscordClick: () => void;
  closeModal: () => void;
}

const FeedbackModal: React.FC<IFeedbackModalProps> = props => {
  const {
    boxSize,
    assetName,
    publicImgPath = '/images',
    imageBoxHasMargin,
    titleLabel,
    subtitleLabel,
    openAnIssueLabel,
    emailUsLabel,
    footerTextLabel,
    footerLinkText1Label,
    footerLinkText2Label,
    onOpenAnIssueClick,
    onEmailUsClick,
    onJoinDiscordClick,
    closeModal,
  } = props;

  // handlers
  const handleOpenAnIssue = () => {
    onOpenAnIssueClick();
  };

  const handleEmailUs = () => {
    onEmailUsClick();
  };

  const handleJoinDiscord = () => {
    onJoinDiscordClick();
  };

  return (
    <ModalWrapper isTransparent={true} isMobile={isMobile} onClick={closeModal}>
      <StyledContentArea isMobile={isMobile}>
        <Box direction="column" pad={{ horizontal: 'medium' }}>
          <Box direction="row" margin={{ top: 'xsmall' }} align="start">
            {isMobile && (
              <Icon
                type="arrowLeft"
                color="secondaryText"
                primaryColor={true}
                clickable={true}
                onClick={closeModal}
              />
            )}
          </Box>
          <Box
            height={boxSize}
            width={boxSize}
            margin={{ ...(imageBoxHasMargin && { bottom: 'small' }) }}
            alignSelf="center"
          >
            <Image fit="contain" src={`${publicImgPath}/${assetName}.png`} />
          </Box>
          <Text
            weight={600}
            margin={{ bottom: 'small', horizontal: 'auto' }}
            size="xlarge"
            textAlign="center"
          >
            {titleLabel}
          </Text>
          <Text
            weight="normal"
            color="secondaryText"
            size="large"
            style={{ lineHeight: '1.6' }}
            textAlign="center"
          >
            {subtitleLabel}
          </Text>
          <StyledButtonWrapper direction="row" justify="end" alignSelf="center">
            <ModalButton
              isMobile={isMobile}
              isOnFeedback={true}
              margin={{ right: '0.5rem' }}
              icon={<Icon type="github" clickable={false} />}
              label={openAnIssueLabel}
              onClick={handleOpenAnIssue}
            />
            <ModalButton
              primary={true}
              isMobile={isMobile}
              isOnFeedback={true}
              icon={<Icon type="email" color="white" clickable={false} />}
              label={emailUsLabel}
              onClick={handleEmailUs}
            />
          </StyledButtonWrapper>
          <StyledFooterArea>
            <Text
              weight="normal"
              color="secondaryText"
              size="medium"
              style={{ lineHeight: '1.6' }}
              textAlign="center"
            >
              {footerTextLabel}
            </Text>
            <Box
              direction="row"
              margin={{ vertical: 'medium' }}
              wrap={true}
              align="center"
              justify="center"
              onClick={handleJoinDiscord}
            >
              <Text color="accentText" margin={{ right: '0.25rem', bottom: '0.2rem' }}>
                {footerLinkText1Label}
              </Text>
              <Icon type="discord" clickable={true} />
              <Text color="accentText" margin={{ horizontal: '0.25rem', bottom: '0.2rem' }}>
                {footerLinkText2Label}
              </Text>
              <Icon type="arrowRight" accentColor={true} clickable={true} />
            </Box>
          </StyledFooterArea>
        </Box>
      </StyledContentArea>
    </ModalWrapper>
  );
};

export default FeedbackModal;
