import React from 'react';
import DS from '@akashaproject/design-system';

import { IPromptAuthorizationProps } from './prompt-authorization';

import illustration from '../assets/illustration-intro';

import { ContentWrapper, PageWrapper } from './styled';

const { Box, Text, Image, Button } = DS;

export interface IPromptAuthenticationProps extends IPromptAuthorizationProps {
  buttonLabel?: string;
  ethAddress: string | null;
  singleSpa: any;
  showLoginModal: () => void;
}

const PromptAuthentication: React.FC<IPromptAuthenticationProps> = props => {
  const { titleLabel, subtitleLabel, buttonLabel, ethAddress, showLoginModal } = props;

  React.useEffect(() => {
    if (ethAddress) {
      props.singleSpa.navigateToUrl('/moderation-app/home');
    }
  }, [ethAddress]);

  return (
    <PageWrapper style={{ background: 'white' }}>
      <ContentWrapper
        pad={{ top: '0rem', horizontal: '1.2rem', bottom: '1.2rem' }}
        margin={{ top: '-2rem' }}
      >
        <Box height="18.75rem" width="18.75rem" alignSelf="center">
          <Image fit="contain" src={illustration} />
        </Box>
        <Text
          weight={600}
          margin={{ bottom: 'medium', horizontal: 'auto' }}
          size="large"
          textAlign="center"
        >
          {titleLabel}
        </Text>
        <Text
          weight="normal"
          margin={{ bottom: 'medium' }}
          color="secondaryText"
          size="medium"
          textAlign="center"
        >
          {subtitleLabel}
        </Text>
        <Box width="fit-content" alignSelf="center">
          <Button primary={true} label={buttonLabel} onClick={showLoginModal} />
        </Box>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default PromptAuthentication;
