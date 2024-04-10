import { TApplicationStatus } from './status-color';

const randomDateBetweenValues = (start = 'Jan 01 2020', end = 'Dec 31 2020') => {
  const timeStart = new Date(start).getTime();
  const timeEnd = new Date(end).getTime();

  return new Date(timeStart + Math.random() * (timeEnd - timeStart));
};

const id = (Math.random() + 1).toString(36).substring(2);

export type TApplicationData = {
  id: string;
  status: TApplicationStatus;
  description?: string;
  reason?: string;
  resolvedDate?: Date;
};

const selfApplicationData: TApplicationData[] = [
  {
    id,
    status: 'pending',
    description: "The admin is reviewing your application; you'll be notified of progress soon!",
  },
  {
    id,
    status: 'approved',
    description:
      'Congrats, your application was approved by the admin! You can start reviewing content now',
  },
  {
    id,
    status: 'rejected',
    description: "Sorry, your application wasn't approved for the following reason:",
    reason:
      'You were reported multiple times by others for the reason of spam links and impersonation',
  },
  {
    id,
    status: 'withdrawn',
    description: 'You have withdrawn your application',
  },
];

export const generateSelfApplicationData = () =>
  selfApplicationData[Math.floor(Math.random() * selfApplicationData.length)];

const applicationData: TApplicationData[] = [
  {
    id,
    status: 'pending',
  },
  {
    id,
    status: 'rejected',
    description:
      'Was reported multiple times by others for the reason of spam links and impersonation',
    resolvedDate: new Date('Feb 14 2024'),
  },
  {
    id,
    status: 'withdrawn',
  },
];

export const generateApplicationData = () =>
  applicationData[Math.floor(Math.random() * applicationData.length)];

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

type TReportEntry = {
  appName: string;
  itemType: 'Profile' | 'Beam' | 'Reply';
  id: string;
  nsfw?: boolean;
};

const reportEntries: TReportEntry[] = [
  { appName: 'Profile', itemType: 'Profile', id: 'P-17078' },
  { appName: 'Antenna', itemType: 'Beam', id: 'B-19089' },
  { appName: 'Antenna', itemType: 'Reply', id: 'R-19090' },
  { appName: 'Profile', itemType: 'Profile', id: 'P-17079', nsfw: true },
];

export const generateReportEntries = () =>
  reportEntries.map(r => ({
    id: r.id,
    appName: r.appName,
    itemType: r.itemType,
    nsfw: r.nsfw,
    primaryReason: 'Sexual or human exploitation',
    reportCount: 46,
    lastReportDate: randomDateBetweenValues('Jan 01 2024', 'Mar 31 2024'),
  }));
