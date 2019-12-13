import { IProfileState } from './interfaces';

export const selectLoggedProfileData = (state: IProfileState) => {
  const profile = state.profiles.find(prof => prof.ethAddress === state.loggedProfile);
  const followers = state.followers.find(profile => profile.profileId === state.loggedProfile);
  return { ...profile, ...followers };
};
