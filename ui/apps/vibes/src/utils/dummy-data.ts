import { EntityTypes, Moderator, ModeratorApplicantData, Profile } from '@akashaorg/typings/lib/ui';
import { EntryCardProps } from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import { reasons } from './reasons';
import {
  TransparencyLogItem,
  TransparencyLogItemType,
} from '../components/transparency-log/log-item';

const randomDateBetweenValues = (start = 'Jan 01 2020', end = 'Dec 31 2020') => {
  const timeStart = new Date(start).getTime();
  const timeEnd = new Date(end).getTime();

  return new Date(timeStart + Math.random() * (timeEnd - timeStart));
};

const entryData = {
  active: true,
  authorId: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8',
  content: null,
  createdAt: '26/02/2024',
  id: 'some random id',
  beamID: 1,
};

export const entryCardProps: EntryCardProps = {
  entryData,
  isLoggedIn: false,
  authorProfile: {
    data: {
      did: { id: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8' },
      name: 'Coffee Lover',
    },
    loading: false,
    error: new Error('an error occured'),
  },
  slateContent: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'Coffee makes me drool',
        },
      ],
    },
  ],
  itemType: EntityTypes?.REFLECT,
  flagAsLabel: 'Flag',
  onContentClick: () => ({}),
  onMentionClick: () => ({}),
  onTagClick: () => ({}),
  transformSource: () => ({
    src: 'https://placebeard.it/360x360',
    width: 360,
    height: 360,
  }),
  contentClickable: false,
};

export const dismissalReasons: { title: string; subtitle: string }[] = [
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

const moderatorStatus = ['active', 'resigned', 'dismissed'];

const moderatorNames = [
  'Jane Doe',
  'Chance Herwitz',
  'Erin Bator',
  'Erin Dokidis',
  'Madelyn Philips',
  'Miracle Vetrovs',
  'Carla Dorwart',
  'Aspen Korsgaard',
  'Desirae Botosh',
  'Randy Torff',
];

export const generateModerators = () => {
  const moderators = moderatorNames.map((name, idx) => {
    const id = (Math.random() + 1).toString(36).substring(2);

    const status = moderatorStatus[Math.floor(Math.random() * moderatorStatus.length)];

    const isAdmin = idx === 0;

    return {
      id: `${idx + 1}`,
      createdAt: randomDateBetweenValues(),
      active: isAdmin ? true : status === 'active',
      admin: isAdmin,
      did: { id: `did:pkh:eip155:5:0xadc81c196296322f9910c060b9ec7917dfbc7c${idx}b` },
      name: name,
      status: isAdmin ? 'active' : status,
      moderatedItems: Math.floor(Math.random() * 106) + 75,
      social: {
        discord: id,
        email: id,
      },
      ...(status !== 'active' && {
        moderatorEndDate: randomDateBetweenValues('Jan 01 2021', 'Dec 31 2022'),
      }),
    };
  });

  return moderators as Moderator[];
};

const activeModeratorNames = [
  'Mr. Bigote',
  'Pugstenson',
  'Jordan Lake',
  'Joan Jett',
  'Rocker Mill',
  'Dudez Jillz',
];

export const generateActiveModerators = () => {
  const activeModerators = activeModeratorNames.map((name, idx) => ({
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

  return activeModerators as Profile[];
};

const applicantNames = [
  'Radioman',
  'Mr. Bigote',
  'Pugstenson',
  'John Wick',
  'Wizard Odd',
  'Jamie Oliver',
  'Cheese Oil',
];

export const generateApplicants = () => {
  const applicants = applicantNames.map((name, idx) => {
    const id = (Math.random() + 1).toString(36).substring(2);

    return {
      id: `${idx + 1}`,
      createdAt: randomDateBetweenValues(),
      did: { id },
      name: name,
      avatar: {
        default: {
          height: 320,
          src: '',
          width: 320,
        },
      },
      applicationDate: new Date('Jan 18 2023').toISOString(),
      reports: [],
      history: [],
    };
  });

  return applicants as ModeratorApplicantData[];
};

const applicantHistoryNames = [
  'mrbigote',
  'pugstenson',
  'johnwick',
  'pugstenson',
  'pugstenson',
  'pugstenson',
  'pugstenson',
  'pugstenson',
];

export const generateApplicationsHistory = () => {
  const logItems = applicantHistoryNames.map((name, idx) => {
    const id = (Math.random() + 1).toString(36).substring(2);

    return {
      id: `${idx + 1}`,
      contentID: id,
      reviewDate: randomDateBetweenValues(),
      name: name,
      approved: idx % 2 === 0,
    };
  });

  return logItems;
};

const moderationHistoryItems: TransparencyLogItemType[] = [
  'Beam',
  'Reflection',
  'Reflection',
  'Profile',
  'Reflection',
  'Beam',
  'Beam',
  'Reflection',
  'Profile',
  'Profile',
];

export const generateModerationHistory = () => {
  const logItems = moderationHistoryItems.map((type, idx) => {
    const id = (Math.random() + 1).toString(36).substring(2);
    const moderationStatus = ['Kept', 'Delisted', ...(type === 'Profile' ? ['Suspended'] : [])];

    return {
      id: `${idx + 1}`,
      type,
      contentId: id,
      reportedDate: randomDateBetweenValues('Jan 01 2020', 'Dec 31 2021'),
      moderatedDate: randomDateBetweenValues('Jan 01 2022', 'Dec 31 2023'),
      status: moderationStatus[Math.floor(Math.random() * moderationStatus.length)],
      reports: 6,
      reason: reasons[Math.floor(Math.random() * reasons.length)].title,
    };
  });

  return logItems as TransparencyLogItem[];
};
