import { Moderator } from '@akashaorg/typings/ui';

export const moderators: Moderator[] = [
  {
    id: '0',
    _mod: new Date('Jan 01 2021'),
    createdAt: new Date('Jan 01 2021'),
    active: false,
    admin: false,
    did: { id: 'bbaaryenljnbjtgmike' },
    name: 'Mike Torello',
    moderatorEndDate: new Date('Dec 31 2021').toISOString(),
    status: 'revoked',
    social: {
      discord: 'miketorello',
      email: 'miketorello',
    },
  },
  {
    id: '1',
    _mod: new Date('Oct 01 2020'),
    createdAt: new Date('Oct 01 2020'),
    active: true,
    admin: false,
    did: { id: 'bbaaryenljnbjtgmike' },
    name: 'April Curtis',
    // moderatorEndDate?: string,
    status: 'active',
    social: {
      discord: 'aprilcurtis',
      email: 'aprilcurtis',
    },
  },
  {
    id: '2',
    _mod: new Date('Nov 01 2022'),
    createdAt: new Date('Nov 01 2022'),
    active: true,
    admin: false,
    did: { id: 'bbaaryenljnbjtgmike' },
    name: 'Murdock',
    // moderatorEndDate?: string,
    status: 'active',
    social: {
      discord: 'murdock',
      email: 'murdock',
    },
  },
  {
    id: '3',
    _mod: new Date('Jan 01 2020'),
    createdAt: new Date('Jan 01 2020'),
    active: false,
    admin: false,
    did: { id: 'bbaaryenljnbjtgmike' },
    name: 'B.A. Baracus',
    moderatorEndDate: new Date('Jun 30 2020').toISOString(),
    status: 'resigned',
    social: {
      discord: 'babaracus',
      email: 'babaracus',
    },
  },
];
