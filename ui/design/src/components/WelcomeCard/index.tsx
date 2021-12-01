import * as React from 'react';
import styled from 'styled-components';
import { Box, Text, Image } from 'grommet';
import { isMobile, isMobileOnly } from 'react-device-detect';

import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { ModalButton } from '../ListModal/styled-modal';

export interface IWelcomeCardProps {
  className?: string;
  assetName?: string;
  publicImgPath?: string;
  titleLabel: string;
  subtitleLabel: string;
  paragraphOneLabel: string;
  paragraphTwoIntroLabel: string;
  paragraphTwoBoldLabel: string;
  paragraphTwoNextLabel: string;
  paragraphThreeLabel: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  handlePrimaryButtonClick: () => void;
  handleSecondaryButtonClick: () => void;
}

const BoldText = styled(Text)`
  font-weight: 600;
  @media screen and (max-width: ${props => props.theme.breakpoints.small.value}px) {
    font-size: 0.938rem;
  }
`;

const WelcomeCard: React.FC<IWelcomeCardProps> = props => {
  const {
    className,
    assetName = 'signup-welcome',
    publicImgPath = '/images',
    titleLabel,
    subtitleLabel,
    paragraphOneLabel,
    paragraphTwoIntroLabel,
    paragraphTwoBoldLabel,
    paragraphTwoNextLabel,
    paragraphThreeLabel,
    primaryButtonLabel,
    secondaryButtonLabel,
    handlePrimaryButtonClick,
    handleSecondaryButtonClick,
  } = props;
  return (
    <MainAreaCardBox
      style={{ height: isMobile ? '100%' : 'auto', overflowY: 'auto' }}
      className={className}
      // props to handle mobile styles
      noBorder={isMobileOnly}
      noBorderRadius={isMobileOnly}
      elevation={isMobileOnly ? 'none' : 'shadow'}
    >
      <Box
        direction="column"
        pad={isMobileOnly ? 'medium' : 'xlarge'}
        height={{ min: 'fit-content' }}
      >
        <Box width={isMobileOnly ? '100%' : '50%'} margin={{ bottom: 'small' }} alignSelf="center">
          <Image fit="contain" src={`${publicImgPath}/${assetName}.png`} />
        </Box>
        <Box
          pad={{ vertical: 'large' }}
          margin={{ bottom: 'xlarge' }}
          border={{ side: 'bottom', color: 'border' }}
        >
          <BoldText size="xlarge" textAlign="center" margin={{ bottom: 'small' }}>
            {titleLabel} 🚀
          </BoldText>
          <Text size="large" textAlign="center" margin={{ bottom: 'medium' }}>
            {subtitleLabel}
          </Text>
        </Box>
        <Text size="large" margin={{ bottom: 'large' }}>
          {paragraphOneLabel}
        </Text>
        <Text size="large" margin={{ bottom: 'large' }}>
          {paragraphTwoIntroLabel}{' '}
          <Text size="large" weight="bold">
            {paragraphTwoBoldLabel}
          </Text>{' '}
          {paragraphTwoNextLabel}
        </Text>
        <Text size="large" margin={{ bottom: 'large' }}>
          {paragraphThreeLabel} 🙌
        </Text>
        <Box width="100%" direction={isMobileOnly ? 'column' : 'row'}>
          <ModalButton
            margin={{
              ...(!isMobileOnly && { right: 'small' }),
              ...(isMobileOnly && { vertical: 'small' }),
            }}
            primary={true}
            isMobile={isMobileOnly}
            isFullWidthOnMobile
            label={primaryButtonLabel}
            onClick={handlePrimaryButtonClick}
          />
          <ModalButton
            isMobile={isMobileOnly}
            isFullWidthOnMobile
            label={secondaryButtonLabel}
            onClick={handleSecondaryButtonClick}
          />
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};

export default WelcomeCard;
