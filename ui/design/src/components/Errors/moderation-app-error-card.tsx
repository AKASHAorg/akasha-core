import React from 'react';
import { Box, Text, Image } from 'grommet';

import { Button } from '../Buttons';

import type { IModerationAppErrorCardProps } from './interfaces';
import { PageWrapper, ContentWrapper } from './styled-elements';

const ModerationAppErrorCard: React.FC<IModerationAppErrorCardProps> = props => {
  const {
    pad,
    size,
    errorType,
    titleLabel,
    subtitleLabel,
    buttonLabel,
    textMarginTop,
    textMarginBottom,
    hasButton,
    boxHasMargin,
    wrapperHasMargin,
    publicImgPath = '/images',
    showLoginModal,
  } = props;

  const handleClick = () => {
    if (showLoginModal) {
      showLoginModal();
    }
  };

  return (
    <PageWrapper style={{ background: 'white' }}>
      <ContentWrapper
        pad={{ top: '0rem', horizontal: pad, bottom: pad }}
        margin={{ ...(wrapperHasMargin && { top: '-2rem' }) }}
      >
        <Box
          height={size}
          width={size}
          margin={{ ...(boxHasMargin && { bottom: 'small' }) }}
          alignSelf="center"
        >
          <Image fit="contain" src={`${publicImgPath}/${errorType}.png`} />
        </Box>
        <Text
          weight={600}
          margin={{ bottom: 'large', horizontal: 'auto' }}
          size="large"
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
          size="medium"
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
