import React from 'react';
import { isMobileOnly } from 'react-device-detect';
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
  assetName?: string;
  publicImgPath?: string;
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
    assetName = 'feedback',
    publicImgPath = '/images',
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
    <ModalWrapper isTransparent={true} isMobile={isMobileOnly} onClick={closeModal}>
      <StyledContentArea isMobile={isMobileOnly}>
        <Box direction="column" pad={{ horizontal: 'medium' }}>
          <Box direction="row" margin={{ top: 'xsmall' }} align="start">
            {isMobileOnly && (
              <Icon
                type="arrowLeft"
                color="secondaryText"
                primaryColor={true}
                clickable={true}
                onClick={closeModal}
              />
            )}
          </Box>
          <Box height="10rem" width="10rem" margin={{ bottom: 'small' }} alignSelf="center">
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
              isMobile={isMobileOnly}
              isOnFeedback={true}
              margin={{ right: '0.5rem' }}
              icon={<Icon type="github" clickable={false} />}
              label={openAnIssueLabel}
              onClick={handleOpenAnIssue}
            />
            <ModalButton
              primary={true}
              isMobile={isMobileOnly}
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
