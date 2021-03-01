import React from 'react';
import DS from '@akashaproject/design-system';

import { IPromptAuthorizationProps } from './prompt-authorization';

const { ModerationAppErrorCard } = DS;

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
    <ModerationAppErrorCard
      pad={'1.2rem'}
      size={'18.75rem'}
      errorType={'no-authentication'}
      titleLabel={titleLabel}
      subtitleLabel={subtitleLabel}
      buttonLabel={buttonLabel}
      textMarginBottom={true}
      hasButton={true}
      wrapperHasMargin={true}
      showLoginModal={showLoginModal}
    />
  );
};

export default PromptAuthentication;
