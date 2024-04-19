import React, { PropsWithChildren } from 'react';
import { useGetLogin, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useEffect } from 'react';

type ProfileWithAuthorizationProps = {
  profileDID: string;
  editingProfile?: boolean;
};
const ProfileWithAuthorization: React.FC<
  PropsWithChildren<ProfileWithAuthorizationProps>
> = props => {
  const { profileDID, editingProfile, children } = props;
  const { data: loginData, loading: authenticating } = useGetLogin();
  const { getRoutingPlugin } = useRootComponentProps();

  useEffect(() => {
    /* redirect user to profile info page if authentication isn't in progress 
      and either user is not logged in or the authenticated viewer is not the owner while editing profile 
    */
    if (
      !authenticating &&
      (!loginData || (editingProfile && loginData && profileDID !== loginData.id))
    ) {
      getRoutingPlugin().navigateTo({
        appName: '@akashaorg/app-profile',
        getNavigationUrl: () => `/${profileDID}`,
      });
      return;
    }
  }, [loginData, editingProfile, getRoutingPlugin, authenticating, profileDID]);

  return <>{children}</>;
};

export default ProfileWithAuthorization;
