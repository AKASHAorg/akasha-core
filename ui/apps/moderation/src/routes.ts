export const HOME = 'Dashboard';
export const HISTORY = 'Transparency Log';
export const GUEST = 'Guest';
export const UNAUTHENTICATED = 'Unauthenticated';
export const MODERATION_VALUE = 'ModerationValue';
export const MODERATORS = 'Moderators';

export default {
  [HOME]: '/home',
  [HISTORY]: '/history',
  [GUEST]: '/guest',
  [UNAUTHENTICATED]: '/unauthenticated',
  [MODERATION_VALUE]: '/values/:value',
  [MODERATORS]: '/moderators',
};
