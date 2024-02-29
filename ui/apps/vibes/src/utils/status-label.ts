import { ModeratorStatus } from '@akashaorg/typings/lib/ui';

/**
 * Generates detail card status label, given the status of the moderator
 * @param status - moderator status
 * @returns string
 */
export const generateModeratorStatusLabel = (status: ModeratorStatus) => {
  if (status === 'active') return 'Moderated';
  else return `${status[0].toUpperCase() + status.slice(1)}`;
};
