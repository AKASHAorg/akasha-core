import * as React from 'react';
import { useProfile } from '../reducers/profiles';

export const withProfileState = (Component: React.ComponentType) => (props: any) => {
  const [profileState, profileDispatch] = useProfile();
  return <Component profileState={profileState} profileDispatch={profileDispatch} {...props} />;
};
