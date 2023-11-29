import { IconType } from '@akashaorg/typings/lib/ui';

export type License = {
  id: string;
  label: string;
  type: IconType;
  icon?: React.ReactElement;
  description: {
    type?: IconType;
    icon?: React.ReactElement;
    text: string;
  }[];
};

export const licences: License[] = [
  {
    id: '1',
    label: 'All rights reserved',
    type: 'LicenseAllRights',
    description: [
      {
        text:
          'Others cannot copy, distribute, or perform your work without your' +
          ' permission (or as permitted by fair use).',
      },
    ],
  },
  {
    id: '2',
    label: 'Some rights reserved',
    type: 'LicenseSomeRights',
    description: [
      {
        text: 'There are some rights reserved with this licence.',
      },
    ],
  },
  {
    id: '3',
    label: 'No rights reserved',
    type: 'LicenseNoRights',
    description: [
      {
        text: 'You will not have any rights.',
      },
    ],
  },
  {
    id: '4',
    label: 'Attribution',
    type: 'LicenseSomeRights',
    description: [
      {
        type: 'LicenseAttribution',
        text: `Others can distribute, remix, and build upon your work as long as they credit you.`,
      },
    ],
  },
  {
    id: '5',
    label: 'Attribution, no derivatives',
    type: 'LicenseSomeRights',
    description: [
      {
        type: 'LicenseAttribution',
        text: `Others can distribute, remix, and build upon your work as long as they credit you.`,
      },
      {
        type: 'LicenseNoDerivatives',
        text: 'Others can only distribute non-derivative copies of your work.',
      },
    ],
  },
  {
    id: '6',
    label: 'Attribution, share-alike',
    type: 'LicenseSomeRights',
    description: [
      {
        type: 'LicenseAttribution',
        text: `Others can distribute, remix, and build upon your work as long as they credit you.`,
      },
      {
        type: 'LicenseShareAlike',
        text: 'Others must distribute derivatives of your work under the same license.',
      },
    ],
  },
  {
    id: '7',
    label: 'Attribution, non-commercial',
    type: 'LicenseSomeRights',
    description: [
      {
        type: 'LicenseAttribution',
        text: `Others can distribute, remix, and build upon your work as long as they credit you.`,
      },
      {
        type: 'LicenseNonCommercial',
        text: 'Others can use your work for non-commercial purposes only. ',
      },
    ],
  },
  {
    id: '8',
    label: 'Attribution, non-commercial, no-derivatives',
    type: 'LicenseSomeRights',
    description: [
      {
        type: 'LicenseAttribution',
        text: `Others can distribute, remix, and build upon your work as long as they credit you.`,
      },
      {
        type: 'LicenseNonCommercial',
        text: 'Others can use your work for non-commercial purposes only. ',
      },
      {
        type: 'LicenseNoDerivatives',
        text: 'Others can only distribute non-derivative copies of your work.',
      },
    ],
  },
  {
    id: '9',
    label: 'Attribution, non-commercial, share-alike',
    type: 'LicenseSomeRights',
    description: [
      {
        type: 'LicenseAttribution',
        text: `Others can distribute, remix, and build upon your work as long as they credit you.`,
      },
      {
        type: 'LicenseNonCommercial',
        text: 'Others can use your work for non-commercial purposes only. ',
      },
      {
        type: 'LicenseShareAlike',
        text: 'Others must distribute derivatives of your work under the same license.',
      },
    ],
  },
  {
    id: '10',
    label: 'Creative Commons copyright waiver',
    type: 'LicenseNoRights',
    description: [
      {
        text: 'You waive all your copyright and related rights in this work, worldwide.',
      },
    ],
  },
  {
    id: '11',
    label: 'Public Domain',
    type: 'LicenseNoRights',
    description: [
      {
        text: 'This work is already in the public domain and free of copyright restrictions.',
      },
    ],
  },
];
