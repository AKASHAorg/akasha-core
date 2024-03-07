export type TApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export const getApplicationStatusColor = (status: TApplicationStatus) => {
  if (status === 'pending') return 'bg(warningLight dark:warningDark)';
  if (status === 'approved') return 'bg-success';
  if (status === 'rejected') return 'bg(errorLight dark: errorDark)';
  return 'bg-grey6';
};
