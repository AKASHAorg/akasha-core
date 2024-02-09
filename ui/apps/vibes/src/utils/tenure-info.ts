import { ModeratorStatus } from '@akashaorg/typings/lib/ui';

/**
 * Generates tenure info, given the status of the moderator
 * @param status - moderator status
 * @returns string
 */
export const generateTenureInfoLabel = (status: ModeratorStatus) => {
  if (status === 'active') return 'Moderator since';
  else return 'Moderation Period';
};
