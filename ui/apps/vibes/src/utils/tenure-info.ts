import { ModeratorStatus } from '@akashaorg/typings/lib/ui';
import { dismissalReasons } from './dummy-data';

/**
 * Generates tenure info, given the status of the moderator
 * @param status - moderator status
 * @returns string
 */
export const generateTenureInfoLabel = (status: ModeratorStatus) => {
  if (status === 'active') return 'Moderator since';
  else return 'Moderation Period';
};

/**
 * Generates reason for dismissal of a moderator
 */
export const generateDismissalReason = () => {
  return dismissalReasons[Math.floor(Math.random() * dismissalReasons.length)];
};
