import * as React from 'react';
import { useParams } from 'react-router-dom';

const InvitePage: React.FC<any> = props => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const { singleSpa } = props;
  if (inviteCode) {
    localStorage.setItem('@signUpToken', inviteCode);
  }
  singleSpa.navigateToUrl('/');
  return <div />;
};

export default InvitePage;
