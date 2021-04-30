import React from 'react';
import { Box, Text, Image } from 'grommet';

import { PageWrapper, ContentWrapper, StyledButton } from '../ErrorLoader/styled-elements';

export interface IModerationAppErrorCardProps {
  size: string;
  errorType: string;
  titleLabel: string;
  subtitleLabel: string;
  buttonLabel?: string;
  textMarginTop?: boolean;
  textMarginBottom?: boolean;
  hasButton?: boolean;
  imageBoxHasMargin?: boolean;
  /* Path to public folder */
  publicImgPath?: string;
  showLoginModal?: () => void;
}

const ModerationAppErrorCard: React.FC<IModerationAppErrorCardProps> = props => {
  const {
    size,
    errorType,
    titleLabel,
    subtitleLabel,
    buttonLabel,
    textMarginTop,
    textMarginBottom,
    hasButton,
    imageBoxHasMargin,
    publicImgPath = '/images',
    showLoginModal,
  } = props;

  const handleClick = () => {
    if (showLoginModal) {
      showLoginModal();
    }
  };

  return (
    <PageWrapper>
      <ContentWrapper pad={{ top: '0rem', horizontal: '5rem', bottom: '1.2rem' }}>
        <Box
          height={size}
          width={size}
          margin={{ ...(imageBoxHasMargin && { bottom: 'small' }) }}
          alignSelf="center"
        >
          <Image fit="contain" src={`${publicImgPath}/${errorType}.png`} />
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
          margin={{
            ...(textMarginTop && { top: 'xsmall' }),
            ...(textMarginBottom && { bottom: 'large' }),
          }}
          color="secondaryText"
          size="large"
          style={{ lineHeight: '1.6' }}
          textAlign="center"
        >
          {subtitleLabel}
        </Text>
        {hasButton && (
          <Box width="fit-content" alignSelf="center">
            <StyledButton primary={true} label={buttonLabel} onClick={handleClick} />
          </Box>
        )}
      </ContentWrapper>
    </PageWrapper>
  );
};

export default ModerationAppErrorCard;
