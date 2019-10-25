export type activeProfilesFilterType = 'followers' | 'following';
export type activeAppsFilterType = 'installed' | 'available';

export interface IProfile {}
export interface IApp {}

export interface IProfileState {
  profiles: IProfile[];
  apps: IApp[];
  activeProfilesFilter?: activeProfilesFilterType;
  activeAppsFilter?: activeAppsFilterType;
}

export interface IReducer<S, A> {
  (action: A, state: S): S;
}

/* Action Payloads */
export interface IGetProfilesPayload {
  profiles: IProfile[];
}
export interface IGetMoreProfilesPayload {
  profiles: IProfile[];
}

export interface IGetAppsPayload {
  apps: IApp[];
}

export interface IGetMoreAppsPayload {
  apps: IApp[];
}

export interface IChangeProfilesFilter {
  filter: activeProfilesFilterType;
}

export interface IChangeAppsFilter {
  filter: activeAppsFilterType;
}
