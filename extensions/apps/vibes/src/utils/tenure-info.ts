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

const dismissalReasons: { title: string; subtitle: string }[] = [
  {
    title: 'Breach of Trust',
    subtitle:
      'Dismissed for compromising community trust by misusing power, showing bias, or leaking confidential information.',
  },
  {
    title: 'Neglect of Duties',
    subtitle:
      'Dismissed for failing to engage actively with moderation tasks, neglecting responsibilities, and not upholding community standards consistently.',
  },
  {
    title: 'Inappropriate Behaviour',
    subtitle:
      'Dismissed for engaging in or condoning inappropriate behavior, violating guidelines, or creating a hostile environment for members',
  },
];

/**
 * Generates reason for dismissal of a moderator
 */
export const generateDismissalReason = () => {
  return dismissalReasons[Math.floor(Math.random() * dismissalReasons.length)];
};
