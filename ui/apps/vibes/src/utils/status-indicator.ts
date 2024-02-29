import { ModeratorStatus } from '@akashaorg/typings/lib/ui';

export const getModeratorStatusIndicator = (status: ModeratorStatus) => {
  if (status === 'active') return 'bg-success';
  if (status === 'dismissed') return 'bg-(errorLight dark:errorDark)';
  return 'bg-(warningLight dark:warningDark)';
};
