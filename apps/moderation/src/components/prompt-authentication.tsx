import React from 'react';
import DS from '@akashaproject/design-system';

import { IPromptAuthorizationProps } from './prompt-authorization';

const { ModerationAppErrorCard } = DS;

export interface IPromptAuthenticationProps extends IPromptAuthorizationProps {
  buttonLabel?: string;
  ethAddress: string | null;
  singleSpa: any;
}

const PromptAuthentication: React.FC<IPromptAuthenticationProps> = props => {
  const { titleLabel, subtitleLabel, ethAddress } = props;

  React.useEffect(() => {
    if (ethAddress) {
      props.singleSpa.navigateToUrl('/moderation-app/home');
    }
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
