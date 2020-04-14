export const EDIT_PAGE = 'Edit Profile';
export const SETTINGS_PAGE = 'Settings';
export const MY_PROFILE_PAGE = 'My 3Box Profile';
export const rootRoute = '/3box-app';
export default {
  [EDIT_PAGE]: `${rootRoute}/edit`,
  [SETTINGS_PAGE]: `${rootRoute}/settings`,
  [MY_PROFILE_PAGE]: `${rootRoute}/profile/:profileId`,
};
