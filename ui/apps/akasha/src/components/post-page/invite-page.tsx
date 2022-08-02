import * as React from 'react';
import { useParams } from 'react-router-dom';
import { RootComponentProps } from '@akashaorg/typings/ui';

const InvitePage: React.FC<RootComponentProps> = props => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  if (inviteCode) {
    localStorage.setItem('@signUpToken', inviteCode);
  }
  props.plugins?.routing?.navigateTo?.({ getNavigationUrl: () => '/' });
  return <div />;
};

export default InvitePage;
