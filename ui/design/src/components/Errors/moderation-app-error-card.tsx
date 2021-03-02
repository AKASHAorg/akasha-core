import React from 'react';
import { Box, Text, Image } from 'grommet';

import { Button } from '../Buttons';

import type { IModerationAppErrorCardProps } from './interfaces';
import { PageWrapper, ContentWrapper } from './styled-elements';

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
          margin={{ bottom: 'medium', horizontal: 'auto' }}
          size="xlarge"
          textAlign="center"
        >
          {titleLabel}
        </Text>
        <Text
          weight="normal"
          margin={{
            ...(textMarginTop && { top: 'xsmall' }),
            ...(textMarginBottom && { bottom: 'medium' }),
          }}
          color="secondaryText"
          size="large"
          textAlign="center"
        >
          {subtitleLabel}
        </Text>
        {hasButton && (
          <Box width="fit-content" alignSelf="center">
            <Button primary={true} label={buttonLabel} onClick={handleClick} />
          </Box>
        )}
      </ContentWrapper>
    </PageWrapper>
  );
};

export default ModerationAppErrorCard;
