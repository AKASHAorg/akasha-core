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
    type: 'licenseAllRights',
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
    type: 'licenseSomeRights',
    description: [
      {
        text: 'There are some rights reserved with this licence.',
      },
    ],
  },
  {
    id: '3',
    label: 'No rights reserved',
    type: 'licenseNoRights',
    description: [
      {
        text: 'You will not have any rights.',
      },
    ],
  },
  {
    id: '4',
    label: 'Attribution',
    type: 'licenseSomeRights',
    description: [
      {
        type: 'licenseAttribution',
        text: `Others can distribute, remix, and build upon your work as long as they credit you.`,
      },
    ],
  },
  {
    id: '5',
    label: 'Attribution, no derivatives',
    type: 'licenseSomeRights',
    description: [
      {
        type: 'licenseAttribution',
        text: `Others can distribute, remix, and build upon your work as long as they credit you.`,
      },
      {
        type: 'licenseNoDerivatives',
        text: 'Others can only distribute non-derivative copies of your work.',
      },
    ],
  },
  {
    id: '6',
    label: 'Attribution, share-alike',
    type: 'licenseSomeRights',
    description: [
      {
        type: 'licenseAttribution',
        text: `Others can distribute, remix, and build upon your work as long as they credit you.`,
      },
      {
        type: 'licenseShareAlike',
        text: 'Others must distribute derivatives of your work under the same license.',
      },
    ],
  },
  {
    id: '7',
    label: 'Attribution, non-commercial',
    type: 'licenseSomeRights',
    description: [
      {
        type: 'licenseAttribution',
        text: `Others can distribute, remix, and build upon your work as long as they credit you.`,
      },
      {
        type: 'licenseNonCommercial',
        text: 'Others can use your work for non-commercial purposes only. ',
      },
    ],
  },
  {
    id: '8',
    label: 'Attribution, non-commercial, no-derivatives',
    type: 'licenseSomeRights',
    description: [
      {
        type: 'licenseAttribution',
        text: `Others can distribute, remix, and build upon your work as long as they credit you.`,
      },
      {
        type: 'licenseNonCommercial',
        text: 'Others can use your work for non-commercial purposes only. ',
      },
      {
        type: 'licenseNoDerivatives',
        text: 'Others can only distribute non-derivative copies of your work.',
      },
    ],
  },
  {
    id: '9',
    label: 'Attribution, non-commercial, share-alike',
    type: 'licenseSomeRights',
    description: [
      {
        type: 'licenseAttribution',
        text: `Others can distribute, remix, and build upon your work as long as they credit you.`,
      },
      {
        type: 'licenseNonCommercial',
        text: 'Others can use your work for non-commercial purposes only. ',
      },
      {
        type: 'licenseShareAlike',
        text: 'Others must distribute derivatives of your work under the same license.',
      },
    ],
  },
  {
    id: '10',
    label: 'Creative Commons copyright waiver',
    type: 'licenseNoRights',
    description: [
      {
        text: 'You waive all your copyright and related rights in this work, worldwide.',
      },
    ],
  },
  {
    id: '11',
    label: 'Public Domain',
    type: 'licenseNoRights',
    description: [
      {
        text: 'This work is already in the public domain and free of copyright restrictions.',
      },
    ],
  },
];
