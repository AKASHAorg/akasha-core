import React from 'react';
import SingleSpa from 'single-spa';

import DS from '@akashaproject/design-system';

import { IPromptAuthorizationProps } from './prompt-authorization';

const { ModerationAppErrorCard } = DS;

export interface IPromptAuthenticationProps extends IPromptAuthorizationProps {
  buttonLabel?: string;
  ethAddress: string | null;
  singleSpa: typeof SingleSpa;
}

const PromptAuthentication: React.FC<IPromptAuthenticationProps> = props => {
  const { titleLabel, subtitleLabel, ethAddress } = props;

  React.useEffect(() => {
    if (ethAddress) {
      props.singleSpa.navigateToUrl('/moderation-app/home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethAddress]);

  return (
    <ModerationAppErrorCard
      boxSize={'18.75rem'}
      errorType={'no-authentication'}
      titleLabel={titleLabel}
      subtitleLabel={subtitleLabel}
      buttonLabel="Moderation history"
      textMarginBottom={true}
      hasButton={true}
      onClick={() => props.singleSpa.navigateToUrl('/moderation-app/history')}
    />
  );
};

export default PromptAuthentication;
