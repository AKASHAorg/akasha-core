import { Moderator, ModeratorApplicantData, Profile } from '@akashaorg/typings/lib/ui';

const randomDateBetweenValues = (start = 'Jan 01 2020', end = 'Dec 31 2020') => {
  const timeStart = new Date(start).getTime();
  const timeEnd = new Date(end).getTime();

  return new Date(timeStart + Math.random() * (timeEnd - timeStart));
};

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

const moderationHistoryItems = [
  'beam',
  'reflect',
  'reflect',
  'profile',
  'reflect',
  'beam',
  'beam',
  'reflect',
  'profile',
];

export const generateModerationHistory = () => {
  const logItems = moderationHistoryItems.map((type, idx) => {
    const id = (Math.random() + 1).toString(36).substring(2);

    return {
      id: `${idx + 1}`,
      contentID: id,
      moderatedDate: randomDateBetweenValues(),
      contentType: type,
      delisted: idx % 2 === 0,
    };
  });

  return logItems;
};
