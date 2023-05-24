import { Moderator, Profile } from '@akashaorg/typings/ui';

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
