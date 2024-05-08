export const EDIT = 'edit';
export const FOLLOWERS = 'followers';
export const FOLLOWING = 'following';
export const INTERESTS = 'interests';
export const BEAMS = 'beams';

export const rootRoute = '';

export default {
  [BEAMS]: `/beams`,
  [FOLLOWERS]: `/followers`,
  [FOLLOWING]: `/following`,
  [INTERESTS]: `/interests`,
  [EDIT]: `/edit`,
} as const;
