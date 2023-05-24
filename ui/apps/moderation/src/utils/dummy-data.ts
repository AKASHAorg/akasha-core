import { Moderator, ModeratorApplicantData, Profile } from '@akashaorg/typings/ui';

const moderatorStatus = ['active', 'resigned', 'revoked'];
const moderatorNames = ['Mike Torello', 'April Curtis', 'Murdock', 'B.A. Baracus'];

export const generateModerators = () => {
  const moderators = moderatorNames.map((name, idx) => {
    const id = (Math.random() + 1).toString(36).substring(2);
    const timeStart = new Date('Jan 01 2020').getTime();
    const timeEnd = new Date('Dec 31 2022').getTime();
    const status = moderatorStatus[Math.floor(Math.random() * moderatorStatus.length)];
    const isAdmin = idx === 0;

    return {
      id: `${idx + 1}`,
      _mod: new Date(Math.floor(Math.random() * Date.now())),
      createdAt: new Date(timeStart + Math.random() * (timeEnd - timeStart)),
      active: isAdmin ? true : status === 'active',
      admin: isAdmin,
      did: { id },
      name: name,
      moderatorEndDate: new Date('Dec 31 2021').toISOString(),
      status: isAdmin ? 'active' : status,
      social: {
        discord: id,
        email: id,
      },
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
    createdAt: new Date(Math.floor(Math.random() * Date.now())),
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

export const applicants: ModeratorApplicantData[] = [
  {
    _id: '0',
    _mod: new Date('Jul 18 2020'),
    joinDate: new Date('Jul 18 2020'),
    pubKey: 'bbaaryenljnbjtgradio',
    ethAddress: '0x3626237234radio',
    name: 'Radioman',
    userName: 'radioman',
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
  },
  {
    _id: '1',
    _mod: new Date('Jul 18 2020'),
    joinDate: new Date('Jul 18 2020'),
    pubKey: 'bbaaryenljnbjtgbigote',
    ethAddress: '0x3626237234bigote',
    name: 'Mr. bigote',
    userName: 'mrbigote',
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
  },
  {
    _id: '2',
    _mod: new Date('Jul 18 2020'),
    joinDate: new Date('Jul 18 2020'),
    pubKey: 'bbaaryenljnbjtgpugstenson',
    ethAddress: '0x3626237234pugstenson',
    name: 'pugstenson',
    userName: 'pugstenson',
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
  },
  {
    _id: '3',
    _mod: new Date('Jul 18 2020'),
    joinDate: new Date('Jul 18 2020'),
    pubKey: 'bbaaryenljnbjtgjohn',
    ethAddress: '0x3626237234johne',
    name: 'John Wick',
    userName: 'johnwick',
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
  },
  {
    _id: '4',
    _mod: new Date('Jul 18 2020'),
    joinDate: new Date('Jul 18 2020'),
    pubKey: 'bbaaryenljnbjtgwizard',
    ethAddress: '0x3626237234wizard',
    name: 'Wizard Odd',
    userName: 'wizardodd',
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
  },
  {
    _id: '5',
    _mod: new Date('Jul 18 2020'),
    joinDate: new Date('Jul 18 2020'),
    pubKey: 'bbaaryenljnbjtgjamie',
    ethAddress: '0x3626237234jamie',
    name: 'Jamie Oliver',
    userName: 'jamieoliver',
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
  },
  {
    _id: '6',
    _mod: new Date('Jul 18 2020'),
    joinDate: new Date('Jul 18 2020'),
    pubKey: 'bbaaryenljnbjtgcheese',
    ethAddress: '0x3626237234cheese',
    name: 'Cheese oil',
    userName: 'cheeseoil',
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
  },
];
