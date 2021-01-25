import React from 'react';
import DS from '@akashaproject/design-system';

import illustration from '../assets/illustration-blocked';

import { ContentWrapper, PageWrapper } from './styled';

const { Box, Text, Image } = DS;

export interface IPromptAuthorizationProps {
  titleLabel: string;
  subtitleLabel: string;
}

const PromptAuthorization: React.FC<IPromptAuthorizationProps> = props => {
  const { titleLabel, subtitleLabel } = props;
  return (
    <PageWrapper style={{ background: 'white' }}>
      <ContentWrapper pad={{ top: '0rem', horizontal: '1.4rem', bottom: '1.4rem' }}>
        <Box height="14rem" width="14rem" margin={{ bottom: 'small' }} alignSelf="center">
          <Image fit="contain" src={illustration} />
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
          margin={{ top: 'xsmall' }}
          color="secondaryText"
          size="medium"
          textAlign="center"
        >
          {subtitleLabel}
        </Text>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default PromptAuthorization;
