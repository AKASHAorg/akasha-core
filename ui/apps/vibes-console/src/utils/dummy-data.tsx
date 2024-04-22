import React from 'react';
import AuthorProfileAvatar from '@akashaorg/ui-lib-feed/lib/components/cards/author-profile-avatar';
import { EntityTypes, EntryData } from '@akashaorg/typings/lib/ui';
import { TApplicationStatus } from './status-color';
import { EntryCardProps } from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import { ProfileItemData } from '@akashaorg/design-system-components/lib/components/VibesConsoleContentCard/mini-profile-cta';

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
  itemData: EntryCardProps | ProfileItemData;
  appName: string;
  itemType: 'Profile' | 'Beam' | 'Reflection';
  id: string;
};

const entryData: EntryData = {
  active: true,
  authorId: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8',
  createdAt: '12/12/2023',
  id: 'kshggg55555',
};

const sampleEntryData: EntryCardProps = {
  isLoggedIn: true,
  entryData,
  profileAvatarExt: (
    <AuthorProfileAvatar authorId={entryData.authorId} createdAt={entryData?.createdAt} />
  ),
  itemType: EntityTypes?.REFLECT,
  flagAsLabel: 'Flag',
  slateContent: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'This content will be reported, for test purposes',
        },
      ],
    },
  ],
  onContentClick: () => ({}),
  onMentionClick: () => ({}),
  onTagClick: () => ({}),
};

const sampleProfileData: ProfileItemData = {
  avatar: {
    height: 320,
    src: '',
    width: 320,
  },
  alternativeAvatars: [],
  name: 'Golden Showers',
  did: { id: 'somerandomdid' },
  nsfw: false,
};

const reportEntries: TReportEntry[] = [
  { itemData: sampleProfileData, appName: 'Profile', itemType: 'Profile', id: 'P-17078' },
  { itemData: sampleEntryData, appName: 'Antenna', itemType: 'Beam', id: 'B-19089' },
  { itemData: sampleEntryData, appName: 'Antenna', itemType: 'Reflection', id: 'R-19090' },
  {
    itemData: { ...sampleProfileData, nsfw: true },
    appName: 'Profile',
    itemType: 'Profile',
    id: 'P-17079',
  },
];

export const generateReportEntries = () =>
  reportEntries.map(r => ({
    id: r.id,
    itemData: r.itemData,
    appName: r.appName,
    itemType: r.itemType,
    primaryReason: 'Sexual or human exploitation',
    reportCount: 46,
    lastReportDate: randomDateBetweenValues('Jan 01 2024', 'Mar 31 2024'),
  }));

const activeModeratorNames = [
  'Mr. Bigote',
  'Pugstenson',
  'Jordan Lake',
  'Joan Jett',
  'Rocker Mill',
  'Dudez Jillz',
];

export const generateActiveModerators = () =>
  activeModeratorNames.map((name, idx) => ({
    id: `${idx + 1}`,
    createdAt: randomDateBetweenValues(),
    did: { id: (Math.random() + 1).toString(36).substring(2) },
    name: name,
    avatar: {
      default: {
        height: 320,
        src: '',
        width: 320,
      },
    },
  }));

const flags = [
  {
    explanation: 'This user is using hateful words',
  },
  {
    explanation: 'Can you hurry up and delist this content?',
  },
  { explanation: '' },
  {
    explanation: "I flagged this many times and it's still there.",
  },
  {
    explanation: 'Can you hurry up and delist this content?',
  },
  {
    explanation: 'At this point Idk what to do.',
  },
  {
    explanation: "This beam violates AKASHA's CoC.",
  },
  { explanation: '' },
  { explanation: '' },
  { explanation: '' },
  { explanation: '' },
  { explanation: '' },
  { explanation: '' },
];

const reports = [
  {
    name: 'Gingerbread',
    flags,
  },
  {
    name: 'Coffee is not real',
    flags: flags.slice(2, 3),
  },
  {
    name: 'John Samsung',
    flags,
  },
  {
    name: 'Cats4eva',
    flags: flags.slice(0, 2),
  },
  {
    name: 'Bree Van de kamp',
    flags: flags.slice(0, 1),
  },
  {
    name: 'Mike Delgado',
    flags,
  },
];

export const generateReports = () =>
  reports.map(r => ({
    ...r,
    did: { id: 'f633FF82ab71' },
    date: randomDateBetweenValues('Jan 01 2024', 'Jan 31 2024'),
  }));
