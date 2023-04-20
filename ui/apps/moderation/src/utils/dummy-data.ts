import { Moderator } from '@akashaorg/typings/ui';

export const moderators: Moderator[] = [
  {
    _id: '0',
    _mod: new Date('Jan 01 2021'),
    creationDate: new Date('Jan 01 2021'),
    active: false,
    admin: false,
    coverImage: '',
    pubKey: 'bbaaryenljnbjtgmike',
    ethAddress: '0x3626237234mike',

    name: 'Mike Torello',
    userName: 'miketorello',
    avatar: {
      url: '',
      fallbackUrl: '',
    },
    moderatorEndDate: new Date('Dec 31 2021').toISOString(),
    status: 'revoked',
    social: {
      discord: 'miketorello',
      email: 'miketorello',
    },
  },
  {
    _id: '1',
    _mod: new Date('Oct 01 2020'),
    creationDate: new Date('Oct 01 2020'),
    active: true,
    admin: false,
    coverImage: '',
    pubKey: 'bbaaryenljnbjtgapril',
    ethAddress: '0x3626237234april',

    name: 'April Curtis',
    userName: 'aprilcurtis',
    avatar: {
      url: '',
      fallbackUrl: '',
    },
    // moderatorEndDate?: string,
    status: 'active',
    social: {
      discord: 'aprilcurtis',
      email: 'aprilcurtis',
    },
  },
  {
    _id: '2',
    _mod: new Date('Nov 01 2022'),
    creationDate: new Date('Nov 01 2022'),
    active: true,
    admin: false,
    coverImage: '',
    pubKey: 'bbaaryenljnbjtgmurdock',
    ethAddress: '0x3626237234murdock',

    name: 'Murdock',
    userName: 'murdock',
    avatar: {
      url: '',
      fallbackUrl: '',
    },
    // moderatorEndDate?: string,
    status: 'active',
    social: {
      discord: 'murdock',
      email: 'murdock',
    },
  },
  {
    _id: '3',
    _mod: new Date('Jan 01 2020'),
    creationDate: new Date('Jan 01 2020'),
    active: false,
    admin: false,
    coverImage: '',
    pubKey: 'bbaaryenljnbjtgba',
    ethAddress: '0x3626237234ba',

    name: 'B.A. Baracus',
    userName: 'babaracus',
    avatar: {
      url: '',
      fallbackUrl: '',
    },
    moderatorEndDate: new Date('Jun 30 2020').toISOString(),
    status: 'resigned',
    social: {
      discord: 'babaracus',
      email: 'babaracus',
    },
  },
];
