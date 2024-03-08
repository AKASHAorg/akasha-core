import { randomDateBetweenValues } from '@akashaorg/design-system-core/lib/utils';
import { TApplicationStatus } from './status-color';

export type TApplicationData = { status: TApplicationStatus; description: string; reason?: string };

const applicationData: TApplicationData[] = [
  {
    status: 'pending',
    description: "The admin is reviewing your application; you'll be notified of progress soon!",
  },
  {
    status: 'approved',
    description:
      'Congrats, your application was approved by the admin! You can start reviewing content now',
  },
  {
    status: 'rejected',
    description: "Sorry, your application wasn't approved for the following reason:",
    reason:
      'You were reported multiple times by others for the reason of spam links and impersonation',
  },
  {
    status: 'withdrawn',
    description: 'You have withdrawn your application',
  },
];

export const generateApplicationData = () =>
  applicationData[Math.floor(Math.random() * applicationData.length)];

const id = (Math.random() + 1).toString(36).substring(2);

const userApplicationStatus: TApplicationStatus[] = [
  'approved',
  'withdrawn',
  'rejected',
  'withdrawn',
  'withdrawn',
  'withdrawn',
  'rejected',
  'withdrawn',
  'rejected',
  'rejected',
];

export const generateUserApplicationHistory = (limit?: number) =>
  userApplicationStatus.slice(0, limit).map(a => ({
    id,
    resolvedDate: randomDateBetweenValues('Dec 05 2023', 'Feb 07 2022'),
    status: a,
  }));

const moderatorApplicants: string[] = [
  'Rollingstone.eth',
  'Chill Pill',
  'Toby Vidal',
  'Bodi.eth',
  'Toby Vidal',
];

const moderatorApplicantsStatus: TApplicationStatus[] = [
  'pending',
  'withdrawn',
  'approved',
  'rejected',
];

export const generateModeratorApplicationHistory = () =>
  moderatorApplicants.map(a => ({
    id,
    name: a,
    avatar: {
      default: {
        height: 320,
        src: '',
        width: 320,
      },
    },
    did: { id },
    status: moderatorApplicantsStatus[Math.floor(Math.random() * moderatorApplicantsStatus.length)],
    appliedOn: randomDateBetweenValues('Jan 01 2024', 'Feb 14 2024'),
    memberSince: randomDateBetweenValues('Jan 01 2020', 'Dec 31 2020'),
  }));
