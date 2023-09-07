import * as React from 'react';
import { useParams } from 'react-router-dom';

import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

const InvitePage: React.FC<unknown> = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const { getRoutingPlugin } = useRootComponentProps();

  if (inviteCode) {
    localStorage.setItem('@signUpToken', inviteCode);
  }
  getRoutingPlugin().navigateTo?.({ getNavigationUrl: () => '/' });
  return <div />;
};

export default InvitePage;
