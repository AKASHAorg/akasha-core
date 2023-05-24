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
      createdAt: new Date(timeStart + Math.random() * (timeEnd - timeStart)),
      active: isAdmin ? true : status === 'active',
      admin: isAdmin,
      did: { id },
      name: name,
      status: isAdmin ? 'active' : status,
      social: {
        discord: id,
        email: id,
      },
      ...(status !== 'active' && { moderatorEndDate: new Date('Dec 31 2021').toISOString() }),
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
    const timeStart = new Date('Jan 01 2020').getTime();
    const timeEnd = new Date('Dec 31 2022').getTime();

    return {
      id: `${idx + 1}`,
      createdAt: new Date(timeStart + Math.random() * (timeEnd - timeStart)),
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
