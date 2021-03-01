import React from 'react';
import DS from '@akashaproject/design-system';

const { ModerationAppErrorCard } = DS;

export interface IPromptAuthorizationProps {
  titleLabel: string;
  subtitleLabel: string;
}

const PromptAuthorization: React.FC<IPromptAuthorizationProps> = props => {
  const { titleLabel, subtitleLabel } = props;
  return (
    <ModerationAppErrorCard
      pad={'1.4rem'}
      size={'14rem'}
      errorType={'no-access-granted'}
      titleLabel={titleLabel}
      subtitleLabel={subtitleLabel}
      textMarginTop={true}
      boxHasMargin={true}
    />
  );
};

export default PromptAuthorization;
