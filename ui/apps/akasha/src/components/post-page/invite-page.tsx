import * as React from 'react';
import { useParams } from 'react-router-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const InvitePage: React.FC<RootComponentProps> = props => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const { singleSpa } = props;
  if (inviteCode) {
    localStorage.setItem('@signUpToken', inviteCode);
  }
  singleSpa.navigateToUrl('/');
  return <div />;
};

export default InvitePage;
