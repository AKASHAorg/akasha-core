import { ModeratorStatus } from '@akashaorg/typings/lib/ui';

export const getModeratorStatusIndicator = (status: ModeratorStatus) => {
  if (status === 'active') return 'bg-success';
  if (status === 'dismissed') return 'bg-errorLight dark:bg-errorDark';
  return 'bg-warningLight dark:bg-warningDark';
};
