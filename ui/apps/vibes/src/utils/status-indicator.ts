export const getModeratorStatusIndicator = (status: string) => {
  if (status === 'active') return 'bg-success';
  if (status === 'revoked') return 'bg-(errorLight dark:errorDark)';
  return 'bg-(warningLight dark:warningDark)';
};
