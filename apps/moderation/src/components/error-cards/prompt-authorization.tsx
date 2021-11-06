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
      boxSize={'14rem'}
      errorType={'no-access-granted'}
      titleLabel={titleLabel}
      subtitleLabel={subtitleLabel}
      textMarginTop={true}
      imageBoxHasMargin={true}
    />
  );
};

export default PromptAuthorization;
