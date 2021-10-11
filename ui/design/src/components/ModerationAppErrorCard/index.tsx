import React from 'react';
import { Box, Text, Image } from 'grommet';

import { PageWrapper, ContentWrapper, StyledButton } from '../ErrorLoader/styled-elements';

export interface IModerationAppErrorCardProps {
  boxSize: string;
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
  onClick?: () => void;
}

const ModerationAppErrorCard: React.FC<IModerationAppErrorCardProps> = props => {
  const {
    boxSize,
    errorType,
    titleLabel,
    subtitleLabel,
    buttonLabel,
    textMarginTop,
    textMarginBottom,
    hasButton,
    imageBoxHasMargin,
    publicImgPath = '/images',
    onClick,
  } = props;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        <Box
          height={boxSize}
          width={boxSize}
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
